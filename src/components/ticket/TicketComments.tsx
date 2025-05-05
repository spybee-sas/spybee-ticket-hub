import React, { useState } from "react";
import { TicketComment, UserType } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateUserType } from "@/utils/ticketUtils";

interface TicketCommentsProps {
  ticketId: string;
  comments: TicketComment[];
  isAdmin?: boolean;
  userDisplayName: string;
  onCommentAdded: (newComment: TicketComment) => void;
}

const TicketComments = ({
  ticketId,
  comments,
  isAdmin = false,
  userDisplayName,
  onCommentAdded,
}: TicketCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentUser = () => {
    // For admin users, get from localStorage
    if (isAdmin) {
      const adminJson = localStorage.getItem("spybee_admin");
      if (adminJson) {
        try {
          return JSON.parse(adminJson);
        } catch (e) {
          console.error("Failed to parse admin data:", e);
        }
      }
      return null;
    }
    
    // For regular users, return null (user info is passed in props)
    return null;
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const currentUser = getCurrentUser();
      
      // Determine user type and ID
      const userType: UserType = isAdmin ? "admin" : "user";
      const userId = currentUser?.id || null;
      
      // Create comment record in Supabase
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert({
          ticket_id: ticketId,
          content: newComment,
          user_type: userType,
          user_id: userId,
          is_internal: isAdmin ? isInternal : false
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Error adding comment: ${error.message}`);
      }
      
      if (data) {
        // Format the new comment to match our TicketComment type
        const validatedUserType = validateUserType(data.user_type);
        
        const formattedComment: TicketComment = {
          id: data.id,
          ticket_id: data.ticket_id,
          user: validatedUserType === 'admin' ? 'Admin' : userDisplayName,
          content: data.content,
          created_at: data.created_at,
          is_internal: data.is_internal,
          user_type: validatedUserType,
          user_id: data.user_id
        };
        
        onCommentAdded(formattedComment);
        setNewComment("");
        setIsInternal(false);
        toast.success("Comment added successfully");
      }
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <h3 className="text-xl font-semibold mb-6">Comments</h3>
      
      {comments.length === 0 ? (
        <p className="text-gray-500 italic mb-6">No comments yet</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className={`p-4 rounded-lg ${
                comment.is_internal 
                  ? "bg-yellow-50 border border-yellow-200" 
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">
                    {comment.user}
                    {comment.is_internal && (
                      <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                        Internal
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-line">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-border pt-6">
        <h4 className="font-medium mb-3">Add a Comment</h4>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
          className="mb-4"
          rows={4}
        />
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {isAdmin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="internal-comment"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="internal-comment" className="text-sm">
                Internal note (only visible to admins)
              </label>
            </div>
          )}
          
          <Button 
            onClick={handleSubmitComment} 
            disabled={isSubmitting}
            className="sm:ml-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketComments;
