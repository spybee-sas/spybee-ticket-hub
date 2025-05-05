import { Ticket, TicketAttachment, TicketComment, UserType } from "../types/ticket";

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: "T-1001",
    name: "John Doe",
    email: "john@example.com",
    project: "Website Redesign",
    category: "Bug",
    description: "The contact form is not submitting properly on the homepage.",
    status: "Open",
    created_at: "2025-04-25T08:30:00Z",
  },
  {
    id: "T-1002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    project: "Mobile App",
    category: "Delivery Issue",
    description: "Still waiting for the initial mockups that were promised last week.",
    status: "In Progress",
    created_at: "2025-04-23T14:45:00Z",
  },
  {
    id: "T-1003",
    name: "Michael Johnson",
    email: "michael@example.com",
    project: "E-commerce Platform",
    category: "Complaint",
    description: "The checkout process is too complicated and customers are abandoning their carts.",
    status: "Closed",
    created_at: "2025-04-20T10:15:00Z",
  },
  {
    id: "T-1004",
    name: "Emma Wilson",
    email: "emma@example.com",
    project: "Blog Migration",
    category: "Bug",
    description: "Images are not displaying correctly in the blog posts after migration.",
    status: "Open",
    created_at: "2025-04-26T09:20:00Z",
  },
  {
    id: "T-1005",
    name: "John Doe",
    email: "john@example.com",
    project: "Website Redesign",
    category: "Other",
    description: "Need to discuss timeline adjustments for the project.",
    status: "In Progress",
    created_at: "2025-04-24T16:10:00Z",
  },
];

// Mock Attachments
export const mockAttachments: TicketAttachment[] = [
  {
    id: "A-1",
    ticket_id: "T-1001",
    file_url: "https://images.unsplash.com/photo-1648972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=200",
    file_name: "error_screenshot.jpg"
  },
  {
    id: "A-2",
    ticket_id: "T-1004",
    file_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
    file_name: "broken_image.jpg"
  },
  {
    id: "A-3",
    ticket_id: "T-1004",
    file_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=200",
    file_name: "console_log.jpg"
  }
];

// Mock Comments
export const mockComments: TicketComment[] = [
  {
    id: "C-1",
    ticket_id: "T-1001",
    user: "Tech Support",
    content: "We're looking into this issue. Can you provide which browser you're using?",
    created_at: "2025-04-25T10:15:00Z",
    is_internal: false,
    user_type: "admin"
  },
  {
    id: "C-2",
    ticket_id: "T-1001",
    user: "Admin",
    content: "This seems to be related to the recent form validation update.",
    created_at: "2025-04-25T10:30:00Z",
    is_internal: true,
    user_type: "admin"
  },
  {
    id: "C-3",
    ticket_id: "T-1002",
    user: "Project Manager",
    content: "I've spoken with the design team, and they will deliver the mockups by EOD today.",
    created_at: "2025-04-24T09:45:00Z",
    is_internal: false,
    user_type: "admin"
  }
];

// Helper function to get attachments for a specific ticket
export const getTicketAttachments = (ticketId: string): TicketAttachment[] => {
  return mockAttachments.filter(attachment => attachment.ticket_id === ticketId);
};

// Helper function to get comments for a specific ticket
export const getTicketComments = (ticketId: string): TicketComment[] => {
  return mockComments.filter(comment => comment.ticket_id === ticketId);
};

// Helper function to get a ticket by ID
export const getTicketById = (ticketId: string): Ticket | undefined => {
  const ticket = mockTickets.find(ticket => ticket.id === ticketId);
  if (ticket) {
    // Add attachments
    ticket.attachments = getTicketAttachments(ticketId);
  }
  return ticket;
};

// Helper function to get tickets by email
export const getTicketsByEmail = (email: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.email.toLowerCase() === email.toLowerCase());
};
