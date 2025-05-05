
import { useState, useEffect } from "react";
import { Ticket, TicketComment, TicketStatus, UserType } from "@/types/ticket";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TicketHeader from "./ticket/TicketHeader";
import TicketAttachments from "./ticket/TicketAttachments";
import TicketComments from "./ticket/TicketComments";

interface TicketDetailProps {
  ticket: Ticket;
  isAdmin?: boolean;
}

const TicketDetail = ({ ticket, isAdmin = false }: TicketDetailProps) => {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [comments, setComments] = useState<TicketComment[]>([]);

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
        const formattedComments: TicketComment[] = data.map(comment => {
          // Validate user_type to ensure it's 'admin' or 'user'
          const validatedUserType: UserType = comment.user_type === 'admin' ? 'admin' : 'user';
          
          return {
            id: comment.id,
            ticket_id: comment.ticket_id,
            user: validatedUserType === 'admin' ? 'Admin' : ticket.name,
            content: comment.content,
            created_at: comment.created_at,
            is_internal: comment.is_internal,
            user_type: validatedUserType,
            user_id: comment.user_id
          };
        });
        
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

  const handleCommentAdded = (newComment: TicketComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  return (
    <div className="space-y-8">
      <TicketHeader 
        ticket={ticket} 
        status={status} 
        isAdmin={isAdmin} 
        onStatusChange={handleStatusChange}
      />
      
      <TicketAttachments attachments={ticket.attachments || []} />
      
      <TicketComments 
        ticketId={ticket.id}
        comments={comments}
        userName={ticket.name}
        isAdmin={isAdmin}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};

export default TicketDetail;
