
import { useState } from "react";
import { TicketComment, UserType } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { validateUserType } from "@/utils/ticketUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TicketCommentsProps {
  comments: TicketComment[];
  ticketId: string;
  isAdmin: boolean;
  updateComments: () => void;
}

const TicketComments = ({ comments, ticketId, isAdmin, updateComments }: TicketCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user info
      const userType: UserType = isAdmin ? "admin" : "user"; // This ensures a valid UserType value
      let userId: string;
      
      if (isAdmin) {
        const adminData = localStorage.getItem("spybee_admin");
        if (!adminData) {
          throw new Error("Admin session not found");
        }
        userId = JSON.parse(adminData).id;
      } else {
        // For regular users (this logic will depend on your auth implementation)
        // This is just a placeholder for now
        userId = localStorage.getItem("user_id") || "anonymous";
      }
      
      console.info("Comment being created with user_type:", userType);
      
      const commentData = {
        ticket_id: ticketId,
        user_id: userId,
        user_type: userType, // Using our validated UserType
        content: newComment,
        is_internal: isAdmin ? false : false
      };
      
      console.info("Submitting comment with data:", commentData);
      
      const { error } = await supabase
        .from('ticket_comments')
        .insert(commentData);
      
      if (error) {
        throw new Error(`Error adding comment: ${error.message}`);
      }
      
      toast.success("Comment added successfully");
      setNewComment("");
      updateComments();
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment", { 
        description: error.message || "Please try again" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4">Comments</h3>
      
      <div className="space-y-4 mb-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-md ${
                validateUserType(comment.user_type) === "admin" 
                  ? "bg-amber-50 border border-amber-200" 
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">
                  {validateUserType(comment.user_type) === "admin" ? "Support Agent" : comment.user}
                </p>
                <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet</p>
        )}
      </div>
      
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder={isAdmin ? "Add a response..." : "Add a comment..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className={isAdmin ? "bg-spybee-dark text-white" : "bg-spybee-yellow text-spybee-dark"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Add Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TicketComments;
