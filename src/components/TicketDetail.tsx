
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
  const [loading, setLoading] = useState(false);

  // Always fetch fresh ticket data when the component mounts
  useEffect(() => {
    fetchTicketData();
    fetchComments();
  }, [ticket.id]);

  const fetchTicketData = async () => {
    setLoading(true);
    try {
      console.log("Fetching fresh ticket data for ID:", ticket.id);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_user_id_fkey (name, email)
        `)
        .eq('id', ticket.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Received fresh ticket data:", data);
        
        // Create a properly formatted ticket object
        const freshTicket: Ticket = {
          id: data.id,
          name: data.users.name,
          email: data.users.email,
          project: data.project,
          category: data.category,
          description: data.description,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: data.user_id
        };
        
        setTicketData(freshTicket);
        setStatus(data.status);
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    console.log(`TicketDetail: Changing status to ${newStatus}`);
    
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
      // Force a refresh of the ticket data if the update failed
      fetchTicketData();
    }
  };

  const handleCommentAdded = (newComment: TicketComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  if (loading) {
    return <div className="text-center py-4">Loading ticket details...</div>;
  }

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
