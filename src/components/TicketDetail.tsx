
import { useState, useEffect } from "react";
import { Ticket, TicketComment, TicketStatus } from "@/types/ticket";
import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface TicketDetailProps {
  ticket: Ticket;
  isAdmin?: boolean;
}

const TicketDetail = ({ ticket, isAdmin = false }: TicketDetailProps) => {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments from Supabase
  useEffect(() => {
    fetchComments();
  }, [ticket.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
      }
      
      if (data) {
        // Transform the data to match our TicketComment type
        const formattedComments: TicketComment[] = data.map(comment => ({
          id: comment.id,
          ticket_id: comment.ticket_id,
          user: comment.user_type === 'admin' ? 'Admin' : ticket.name,
          content: comment.content,
          created_at: comment.created_at,
          is_internal: comment.is_internal
        }));
        
        setComments(formattedComments);
      }
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      // Update ticket status in Supabase
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticket.id);
      
      if (error) {
        throw new Error(`Error updating status: ${error.message}`);
      }
      
      setStatus(newStatus);
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Get the user type (admin or regular user)
      const userType = isAdmin ? 'admin' : 'user';
      
      // Get the user ID - for admin, get from localStorage
      let userId = null;
      if (isAdmin) {
        const adminData = localStorage.getItem("spybee_admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          userId = admin.id;
        }
      } else {
        // For regular users, use the ticket's user ID
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', ticket.email)
          .single();
        
        if (error || !data) {
          console.error("Error fetching user ID:", error);
        } else {
          userId = data.id;
        }
      }
      
      if (!userId) {
        // Fallback to a placeholder ID if necessary
        const { data: fallbackUserData } = await supabase
          .from('users')
          .select('id')
          .eq('email', ticket.email)
          .maybeSingle();
          
        userId = fallbackUserData?.id || '00000000-0000-0000-0000-000000000000';
      }
      
      // Create the new comment in Supabase - ensure user_type is either 'admin' or 'user'
      const newCommentData = {
        ticket_id: ticket.id,
        user_id: userId,
        user_type: userType === 'admin' ? 'admin' : 'user', // Ensure only allowed values are used
        content: comment,
        is_internal: isAdmin && isInternal
      };
      
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert(newCommentData)
        .select();
      
      if (error) {
        console.error("Error adding comment:", error);
        throw new Error(`Error adding comment: ${error.message}`);
      }
      
      if (data && data.length > 0) {
        // Add the new comment to the state
        const newComment: TicketComment = {
          id: data[0].id,
          ticket_id: data[0].ticket_id,
          user: userType === 'admin' ? 'Admin' : ticket.name,
          content: data[0].content,
          created_at: data[0].created_at,
          is_internal: data[0].is_internal
        };
        
        setComments(prev => [newComment, ...prev]);
        setComment("");
        toast.success("Comment added successfully");
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error(`Failed to add comment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-amber-100 text-amber-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Bug":
        return "bg-red-100 text-red-800";
      case "Complaint":
        return "bg-purple-100 text-purple-800";
      case "Delivery Issue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-spybee-dark mb-2">
              {ticket.project}
            </h2>
            <p className="text-gray-500 mb-2">ID: {ticket.id}</p>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getCategoryColor(ticket.category)}>
                {ticket.category}
              </Badge>
              <Badge className={getStatusColor(status)}>{status}</Badge>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              Submitted by {ticket.name} ({ticket.email})
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(ticket.created_at), "PPP")}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
        </div>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ticket.attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-md overflow-hidden">
                  <img
                    src={attachment.file_url}
                    alt={attachment.file_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-sm">
                    <p className="truncate">{attachment.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">Update Status</h3>
              <Select
                value={status}
                onValueChange={(value) => handleStatusChange(value as TicketStatus)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3"
            />
            {isAdmin && (
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="internal"
                  checked={isInternal}
                  onChange={() => setIsInternal(!isInternal)}
                  className="mr-2"
                />
                <label htmlFor="internal" className="text-sm">
                  Internal note (only visible to admin)
                </label>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                className="bg-spybee-yellow hover:bg-amber-400 text-spybee-dark"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Comment"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {comments
              .filter((c) => !c.is_internal || isAdmin)
              .map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.is_internal
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {comment.user}
                      {comment.is_internal && (
                        <span className="ml-2 text-amber-600 text-xs font-normal">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}

            {comments.filter((c) => !c.is_internal || isAdmin).length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No comments yet. Be the first to add a comment!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetail;
