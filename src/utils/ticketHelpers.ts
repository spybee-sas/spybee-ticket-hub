
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
): Promise<boolean> => {
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
    
    toast.dismiss(toastId);
    
    if (result.success) {
      toast.success(`Ticket status updated to ${newStatus}`);
      return true;
    } else {
      toast.error("Failed to update ticket status", {
        description: result.error || "Please try again later"
      });
      // Don't forcefully refresh tickets immediately as it might overwrite optimistic updates
      return false;
    }
  } catch (error: any) {
    toast.dismiss(toastId);
    toast.error("Error updating ticket status", {
      description: error.message || "Please try again later"
    });
    return false;
  }
};

// Helper function to handle drag and drop of tickets
export const handleDragEnd = async (
  result: any, 
  tickets: Ticket[], 
  mapColumnToStatus: (columnId: string) => TicketStatus | undefined,
  handleStatusChange: (id: string, status: TicketStatus) => Promise<boolean>
): Promise<boolean> => {
  const { source, destination, draggableId } = result;
  
  // If dropped outside a droppable area or dropped in the same place
  if (!destination || 
      (source.droppableId === destination.droppableId && 
      source.index === destination.index)) {
    return false;
  }
  
  // Get the ticket being dragged
  const ticketId = draggableId;
  
  // Get the new status based on destination column
  const newStatus = mapColumnToStatus(destination.droppableId);
  
  if (newStatus) {
    console.log(`Drag-and-drop: Changing ticket ${ticketId} status to ${newStatus}`);
    // Update the ticket status
    return await handleStatusChange(ticketId, newStatus);
  }
  
  return false;
};
