
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TicketComment, UserType } from "@/types/ticket";
import { toast } from "sonner";
import { fetchTicketComments, addTicketComment } from "@/utils/commentUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TicketCommentsProps {
  ticketId: string;
  comments: TicketComment[];
  onCommentAdded: (comment: TicketComment) => void;
  isAdmin: boolean;
  userDisplayName: string;
  userId?: string; // Add userId prop to track which user is making comments
}

const TicketComments = ({ 
  ticketId, 
  comments, 
  onCommentAdded, 
  isAdmin, 
  userDisplayName,
  userId = "anonymous" // Default to "anonymous" if no userId provided
}: TicketCommentsProps) => {
  const { t } = useLanguage();
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get admin info from localStorage if available
  const adminInfo = isAdmin ? JSON.parse(localStorage.getItem("spybee_admin") || "{}") : null;
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error(t('comments.empty'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userType: UserType = isAdmin ? 'admin' : 'user';
      // Use adminId for admins, or the provided userId for users
      const commentUserId = isAdmin ? (adminInfo?.id || 'anonymous') : userId;
      
      // Use the utility function to add the comment
      const newCommentObj = await addTicketComment(
        ticketId,
        newComment,
        commentUserId,
        userType,
        isAdmin && isInternal
      );
      
      if (newCommentObj) {
        onCommentAdded(newCommentObj);
        setNewComment("");
        setIsInternal(false);
        toast.success(t('comments.added'));
      }
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast.error(t('comments.error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter out internal comments for non-admin users
  const visibleComments = comments.filter(comment => isAdmin || !comment.is_internal);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{t('comments.title')}</h3>
      
      <form onSubmit={handleSubmitComment} className="mb-6">
        <Textarea
          placeholder={t('comments.placeholder')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3"
          rows={4}
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <Switch
                id="internal-comment"
                checked={isInternal}
                onCheckedChange={setIsInternal}
              />
              <label htmlFor="internal-comment" className="text-sm cursor-pointer">
                {t('comments.internal')}
              </label>
            </div>
          )}
          
          <Button
            type="submit"
            className="bg-spybee-dark hover:bg-black text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('comments.submitting') : t('comments.submit')}
          </Button>
        </div>
      </form>
      
      {visibleComments.length > 0 ? (
        <div className="space-y-4">
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.is_internal
                  ? "bg-yellow-50 border border-yellow-200"
                  : comment.user_type === "admin"
                  ? "bg-gray-50 border border-gray-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex justify-between mb-2">
                <div className="font-medium flex items-center">
                  {comment.user}
                  {comment.is_internal && (
                    <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                      {t('comments.internalLabel')}
                    </span>
                  )}
                  {comment.user_type === "admin" && (
                    <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                      {t('comments.adminLabel')}
                    </span>
                  )}
                  {comment.user_type === "user" && (
                    <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                      {t('comments.customerLabel')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'PPP p')}
                </div>
              </div>
              <div className="whitespace-pre-line">{comment.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {t('comments.none')}
        </div>
      )}
    </div>
  );
};

export default TicketComments;
