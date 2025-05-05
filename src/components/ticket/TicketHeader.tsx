
import { Ticket, TicketStatus } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getStatusColor, getCategoryColor } from "@/utils/ticketUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TicketHeaderProps {
  ticket: Ticket;
  status: TicketStatus;
  isAdmin?: boolean;
  onStatusChange: (newStatus: TicketStatus) => void;
}

const TicketHeader = ({ ticket, status, isAdmin = false, onStatusChange }: TicketHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-spybee-dark mb-2">
            {ticket.project}
          </h2>
          <p className="text-gray-500 mb-2">ID: {ticket.id}</p>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={getCategoryColor(ticket.category)}>
              {ticket.category}
            </Badge>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
            Submitted by {ticket.name} ({ticket.email})
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(ticket.created_at), "PPP")}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
      </div>

      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Update Status</h3>
            <Select
              value={status}
              onValueChange={(value) => onStatusChange(value as TicketStatus)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketHeader;
