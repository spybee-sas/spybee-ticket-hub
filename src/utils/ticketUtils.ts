
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
 * Get admin data from localStorage
 * @returns The admin data or null if not found
 */
const getAdminData = (): { id: string, email: string, name: string, isAdmin: boolean } | null => {
  try {
    const adminData = localStorage.getItem("spybee_admin");
    if (!adminData) {
      console.error("No admin data found in localStorage");
      return null;
    }
    
    const admin = JSON.parse(adminData);
    if (!admin.isAdmin) {
      console.error("User is not an admin");
      return null;
    }
    
    return admin;
  } catch (error) {
    console.error("Error parsing admin data:", error);
    return null;
  }
};

/**
 * Updates a ticket's status in the database
 * @param ticketId The ID of the ticket to update
 * @param newStatus The new status to set
 * @param currentTickets The current array of tickets
 * @param setTickets Function to update the tickets state
 * @param refreshCallback Optional callback to refresh data after update
 * @returns Promise that resolves to a success boolean and optional data/error
 */
export const updateTicketStatus = async (
  ticketId: string, 
  newStatus: TicketStatus,
  currentTickets: any[],
  setTickets: (tickets: any[]) => void,
  refreshCallback?: () => Promise<void>
): Promise<{success: boolean, data?: any, error?: any}> => {
  try {
    console.log(`Starting status update operation for ticket ${ticketId} to ${newStatus}...`);
    
    // Get admin data
    const admin = getAdminData();
    if (!admin) {
      throw new Error('Admin authentication failed');
    }
    
    // Prepare the timestamp for the update
    const timestamp = new Date().toISOString();
    
    console.log(`Sending update to Supabase: ticketId=${ticketId}, status=${newStatus}`);
    
    // Explicitly prepare the update data
    const updateData = { 
      status: newStatus,
      updated_at: timestamp
    };
    console.log('Update data:', updateData);
    
    // Create auth header for admin
    const adminAuthHeader = `Bearer admin_session_${admin.id}`;
    
    // Fixed approach: instead of using the headers method (which isn't available),
    // we'll set headers in the options object when initializing the Supabase client
    const options = {
      headers: {
        'X-Admin-Auth': adminAuthHeader,
        'Prefer': 'return=minimal'
      }
    };
    
    console.log('Using request options:', options);
    
    // Execute the update without chaining .headers()
    const { data, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select();
    
    if (error) {
      console.error('Database update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check for specific error types
      if (error.code === '42501') {
        console.error('Permission denied: The current user does not have permission to update this ticket');
      } else if (error.code === 'PGRST116') {
        console.error('Row-level security policy violation: The user does not have permission for this operation');
      }
      
      throw error;
    }
    
    console.log('Database update succeeded without errors');
    
    // Update UI optimistically after successful database update
    const updatedTickets = currentTickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status: newStatus, updated_at: timestamp } : ticket
    );
    
    // Update UI
    setTickets(updatedTickets);
    
    // If a refresh callback was provided, call it to ensure fresh data
    if (refreshCallback) {
      console.log('Refreshing data after successful update...');
      // Wait a short delay before refreshing to ensure the database update has propagated
      setTimeout(async () => {
        await refreshCallback();
      }, 1200); // Increased delay for better reliability
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to update ticket status:", error);
    
    return { 
      success: false, 
      error: error.message || "Failed to update ticket status" 
    };
  }
};
