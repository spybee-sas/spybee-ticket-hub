
import { UserType } from "@/types/ticket";

// Function to validate user type
export const validateUserType = (userType: string): UserType => {
  if (userType === "admin" || userType === "user") {
    return userType;
  }
  // Default to "user" if not valid
  return "user";
};

// Add additional ticket utility functions here if needed
