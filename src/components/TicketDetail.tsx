
import { useState, useEffect } from "react";
import { Ticket, TicketComment, TicketStatus, UserType } from "@/types/ticket";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TicketHeader from "./ticket/TicketHeader";
import TicketAttachments from "./ticket/TicketAttachments";
import TicketComments from "./ticket/TicketComments";
import { validateUserType, updateTicketStatus } from "@/utils/ticketUtils";
import { fetchTicketComments } from "@/utils/commentUtils";

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
    fetchCommentsData();
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

  const fetchCommentsData = async () => {
    try {
      const commentsData = await fetchTicketComments(ticket.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    console.log(`TicketDetail: Changing status from ${status} to ${newStatus} for ticket ${ticket.id}`);
    
    // Show loading toast
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    
    // Create a temporary array with just this ticket for the updateTicketStatus function
    const singleTicketArray = [ticketData];
    
    try {
      const result = await updateTicketStatus(
        ticket.id, 
        newStatus, 
        singleTicketArray, 
        (updatedTickets) => {
          if (updatedTickets.length > 0) {
            setTicketData(updatedTickets[0]);
            setStatus(newStatus);
          }
        },
        fetchTicketData // Pass the fetch function as a callback to ensure data is refreshed
      );
      
      toast.dismiss(toastId);
      
      if (result.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update ticket status", {
          description: result.error || "Please try again"
        });
        fetchTicketData(); // Refresh data if update failed
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error("Error updating ticket status", {
        description: error.message || "Please try again"
      });
      fetchTicketData(); // Refresh data if there was an error
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
        userId={ticketData.user_id}
      />
    </div>
  );
};

export default TicketDetail;
