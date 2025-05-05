
import { useState } from "react";
import { TicketComment, UserType } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TicketCommentsProps {
  ticketId: string;
  comments: TicketComment[];
  userName: string;
  isAdmin: boolean;
  onCommentAdded: (newComment: TicketComment) => void;
}

const TicketComments = ({ 
  ticketId, 
  comments, 
  userName, 
  isAdmin, 
  onCommentAdded 
}: TicketCommentsProps) => {
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setIsLoading(true);
    
    try {
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
          .from('tickets')
          .select('user_id')
          .eq('id', ticketId)
          .single();
        
        if (error) {
          console.error("Error fetching ticket user ID:", error);
        } else if (data) {
          userId = data.user_id;
        }
      }
      
      if (!userId) {
        console.log("Fallback: Looking up user ID by email");
        // Try to get user ID by email as fallback
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', userName)
          .maybeSingle();
          
        if (userError) {
          console.error("Error in fallback user lookup:", userError);
        } else if (userData) {
          userId = userData.id;
          console.log("Found user ID via email:", userId);
        }
      }
      
      // If still no userId, use a placeholder (shouldn't normally happen)
      if (!userId) {
        console.warn("Could not determine user ID for comment - using placeholder");
        userId = '00000000-0000-0000-0000-000000000000';
      }
      
      // Determine user_type based on isAdmin flag
      const userType: UserType = isAdmin ? 'admin' : 'user';
      
      console.log("Comment being created with user_type:", userType);
      
      // Create the comment data with validated user_type
      const newCommentData = {
        ticket_id: ticketId,
        user_id: userId,
        user_type: userType,
        content: comment,
        is_internal: isAdmin && isInternal
      };
      
      console.log("Submitting comment with data:", newCommentData);
      
      // Insert the comment
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
        // Ensure user_type is properly validated as 'admin' or 'user'
        const validatedUserType: UserType = data[0].user_type === 'admin' ? 'admin' : 'user';
        
        const newComment: TicketComment = {
          id: data[0].id,
          ticket_id: data[0].ticket_id,
          user: isAdmin ? 'Admin' : userName,
          content: data[0].content,
          created_at: data[0].created_at,
          is_internal: data[0].is_internal,
          user_type: validatedUserType,
          user_id: data[0].user_id
        };
        
        onCommentAdded(newComment);
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

  return (
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
  );
};

export default TicketComments;
