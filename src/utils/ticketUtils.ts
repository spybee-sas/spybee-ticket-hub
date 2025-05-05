
import { UserType, TicketStatus } from "@/types/ticket";

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
