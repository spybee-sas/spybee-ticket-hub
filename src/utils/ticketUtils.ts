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
    
    // Update the ticket in Supabase using the REST API directly
    // Using the project URL from the environment instead of accessing protected properties
    const supabaseUrl = "https://badvvskmnfzuichrwzhg.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZHZ2c2ttbmZ6dWljaHJ3emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDE2NDQsImV4cCI6MjA2MTAxNzY0NH0.TOLfY1pf1hzCXrLVoN8s7eGHLOc8M_YNlBdx34HQ6QM";
    
    const response = await fetch(`${supabaseUrl}/rest/v1/tickets?id=eq.${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey, // Adding the apikey header which was missing
        'X-Admin-Auth': `Bearer admin_session_${admin.id}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Database update failed:', response.status, errorText);
      throw new Error(`Failed to update ticket: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Database update succeeded:', data);
    
    // Update UI optimistically
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
