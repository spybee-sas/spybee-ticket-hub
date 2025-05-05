
import { Ticket, TicketStatus } from "@/types/ticket";
import { toast } from "sonner";
import { updateTicketStatus } from "./ticketUtils";

// Function to handle ticket status change with proper feedback
export const handleTicketStatusChange = async (
  ticketId: string,
  newStatus: TicketStatus,
  tickets: Ticket[],
  setTickets: (tickets: Ticket[]) => void,
  fetchTickets?: () => Promise<void>
) => {
  console.log(`handleTicketStatusChange: Changing ticket ${ticketId} status to ${newStatus}`);
  
  // Show loading toast to provide feedback during status change
  const toastId = toast.loading(`Updating ticket status to ${newStatus}...`);
  
  try {
    const result = await updateTicketStatus(
      ticketId, 
      newStatus, 
      tickets, 
      setTickets,
      fetchTickets // Pass the fetchTickets function as a callback to refresh data
    );
    
    if (result.success) {
      toast.dismiss(toastId);
      toast.success(`Ticket ${ticketId} status updated to ${newStatus}`);
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to update ticket status", {
        description: result.error || "Please try again later"
      });
    }
  } catch (error: any) {
    toast.dismiss(toastId);
    toast.error("Error updating ticket status", {
      description: error.message || "Please try again later"
    });
    // Refresh tickets to ensure UI is in sync with database
    if (fetchTickets) {
      fetchTickets();
    }
  }
};

// Helper function to handle drag and drop of tickets
export const handleDragEnd = (
  result: any, 
  tickets: Ticket[], 
  mapColumnToStatus: (columnId: string) => TicketStatus | undefined,
  handleStatusChange: (id: string, status: TicketStatus) => void
) => {
  const { source, destination, draggableId } = result;
  
  // If dropped outside a droppable area or dropped in the same place
  if (!destination || 
      (source.droppableId === destination.droppableId && 
      source.index === destination.index)) {
    return;
  }
  
  // Get the ticket being dragged
  const ticketId = draggableId;
  
  // Get the new status based on destination column
  const newStatus = mapColumnToStatus(destination.droppableId);
  
  if (newStatus) {
    console.log(`Drag-and-drop: Changing ticket ${ticketId} status to ${newStatus}`);
    // Update the ticket status
    handleStatusChange(ticketId, newStatus);
  }
};
