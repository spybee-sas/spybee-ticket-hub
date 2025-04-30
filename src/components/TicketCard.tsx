
import { Ticket } from "@/types/ticket";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface TicketCardProps {
  ticket: Ticket;
  showDetailsLink?: boolean;
  isAdmin?: boolean;
}

const TicketCard = ({ ticket, showDetailsLink = true, isAdmin = false }: TicketCardProps) => {
  const getStatusColor = (status: string) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Bug":
        return "bg-red-100 text-red-800";
      case "Complaint":
        return "bg-purple-100 text-purple-800";
      case "Delivery Issue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="ticket-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-spybee-dark">{ticket.project}</h3>
        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
      </div>
      
      <div className="mb-3">
        <Badge variant="outline" className={getCategoryColor(ticket.category)}>
          {ticket.category}
        </Badge>
      </div>
      
      <p className="text-gray-600 line-clamp-2 mb-4">{ticket.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>ID: {ticket.id}</span>
        <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
      </div>
      
      {showDetailsLink && (
        <div className="mt-4 text-right">
          <Link 
            to={isAdmin ? `/admin/tickets/${ticket.id}` : `/tickets/${ticket.id}`}
            className="text-spybee-yellow hover:underline font-medium"
          >
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
