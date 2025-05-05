
export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export type TicketCategory = 'Bug' | 'Complaint' | 'Delivery Issue' | 'Other';

export interface Ticket {
  id: string;
  name: string;
  email: string;
  project: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  title?: string;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_url: string;
  file_name: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user: string;
  content: string;
  created_at: string;
  is_internal: boolean;
  user_type: 'admin' | 'user';
  user_id?: string;
}
