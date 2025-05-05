
import { useState, useEffect } from "react";
import { Ticket, TicketComment, TicketStatus, UserType } from "@/types/ticket";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TicketHeader from "./ticket/TicketHeader";
import TicketAttachments from "./ticket/TicketAttachments";
import TicketComments from "./ticket/TicketComments";
import { validateUserType, updateTicketStatus } from "@/utils/ticketUtils";

interface TicketDetailProps {
  ticket: Ticket;
  isAdmin?: boolean;
}

const TicketDetail = ({ ticket, isAdmin = false }: TicketDetailProps) => {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [ticketData, setTicketData] = useState<Ticket>(ticket);

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
          const validatedUserType: UserType = validateUserType(comment.user_type);
          
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
    // Use the centralized function for updating ticket status
    const result = await updateTicketStatus(
      ticket.id, 
      newStatus, 
      [ticketData], 
      (updatedTickets) => {
        if (updatedTickets.length > 0) {
          setTicketData(updatedTickets[0]);
          setStatus(newStatus);
        }
      }
    );
    
    if (result.success) {
      toast.success(`Ticket status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update ticket status");
    }
  };

  const handleCommentAdded = (newComment: TicketComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  return (
    <div className="space-y-8">
      <TicketHeader 
        ticket={ticketData} 
        status={status} 
        isAdmin={isAdmin} 
        onStatusChange={handleStatusChange}
      />
      
      <TicketAttachments attachments={ticketData.attachments || []} />
      
      <TicketComments 
        ticketId={ticketData.id}
        comments={comments}
        onCommentAdded={handleCommentAdded}
        isAdmin={isAdmin}
        userDisplayName={ticketData.name}
      />
    </div>
  );
};

export default TicketDetail;
