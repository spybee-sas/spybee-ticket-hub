
import { TicketCategory, TicketStatus, UserType } from "@/types/ticket";

// Function to validate user type
export const validateUserType = (userType: string): UserType => {
  if (userType === "admin" || userType === "user") {
    return userType;
  }
  // Default to "user" if not valid
  return "user";
};

// Function to get status color based on ticket status
export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case "Open":
      return "bg-blue-500 hover:bg-blue-600";
    case "In Progress":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Closed":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-blue-500 hover:bg-blue-600";
  }
};

// Function to get category color based on ticket category
export const getCategoryColor = (category: TicketCategory): string => {
  switch (category) {
    case "Bug":
      return "bg-red-500 hover:bg-red-600";
    case "Complaint":
      return "bg-purple-500 hover:bg-purple-600";
    case "Delivery Issue":
      return "bg-orange-500 hover:bg-orange-600";
    case "Other":
      return "bg-green-500 hover:bg-green-600";
    default:
      return "bg-green-500 hover:bg-green-600";
  }
};
