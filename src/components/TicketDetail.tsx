
import { useState } from "react";
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
import { mockComments, getTicketComments } from "@/lib/mockData";

interface TicketDetailProps {
  ticket: Ticket;
  isAdmin?: boolean;
}

const TicketDetail = ({ ticket, isAdmin = false }: TicketDetailProps) => {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<TicketComment[]>(
    getTicketComments(ticket.id)
  );
  const [isInternal, setIsInternal] = useState(false);

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatus(newStatus);
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment: TicketComment = {
      id: `C-${Date.now()}`,
      ticket_id: ticket.id,
      user: isAdmin ? "Admin" : ticket.name,
      content: comment,
      created_at: new Date().toISOString(),
      is_internal: isInternal,
    };

    setComments((prev) => [newComment, ...prev]);
    setComment("");
    toast.success("Comment added successfully");
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
              >
                Add Comment
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
