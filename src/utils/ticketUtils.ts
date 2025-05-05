
import { UserType, TicketStatus } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates user type to ensure it's either 'admin' or 'user'
 * @param userType The user type to validate
 * @returns A validated UserType ('admin' or 'user')
 */
export const validateUserType = (userType: string): UserType => {
  return userType === 'admin' ? 'admin' : 'user';
};

/**
 * Maps Kanban column IDs to ticket status values
 * @param columnId The column ID from the Kanban board
 * @returns The corresponding TicketStatus, or undefined if not found
 */
export const mapColumnToStatus = (columnId: string): TicketStatus | undefined => {
  const statusMap: Record<string, TicketStatus> = {
    "open-column": "Open",
    "in-progress-column": "In Progress",
    "closed-column": "Closed"
  };
  
  return statusMap[columnId];
};

/**
 * Gets the appropriate color class based on ticket status
 * @param status The ticket status
 * @returns A Tailwind CSS color class
 */
export const getStatusColorClass = (status: TicketStatus): string => {
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

/**
 * Gets the column ID that corresponds to a ticket status
 * @param status The ticket status
 * @returns The corresponding column ID for the Kanban board
 */
export const getColumnIdFromStatus = (status: TicketStatus): string => {
  const columnMap: Record<TicketStatus, string> = {
    "Open": "open-column",
    "In Progress": "in-progress-column",
    "Closed": "closed-column"
  };
  
  return columnMap[status];
};

/**
 * Updates a ticket's status in the database and handles optimistic UI updates
 * @param ticketId The ID of the ticket to update
 * @param newStatus The new status to set
 * @param currentTickets The current array of tickets
 * @param setTickets Function to update the tickets state
 * @returns Promise that resolves when the update is complete
 */
export const updateTicketStatus = async (
  ticketId: string, 
  newStatus: TicketStatus,
  currentTickets: any[],
  setTickets: (tickets: any[]) => void
) => {
  // First update local state for optimistic UI
  const updatedTickets = currentTickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() } : ticket
  );
  
  setTickets(updatedTickets);
  
  try {
    console.log(`Updating ticket ${ticketId} status to ${newStatus}...`);
    
    // Update status in Supabase
    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select('*');
    
    if (error) {
      console.error('Database update error:', error);
      throw error;
    }
    
    console.log('Update response data:', data);
    
    if (!data || data.length === 0) {
      console.warn('No data returned from update operation');
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to update ticket status:", error);
    
    // Revert local state on error
    setTickets(currentTickets);
    
    return { 
      success: false, 
      error: error.message || "Failed to update ticket status" 
    };
  }
};
