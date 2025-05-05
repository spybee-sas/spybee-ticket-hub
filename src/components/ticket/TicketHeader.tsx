
import { Ticket, TicketStatus } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface TicketHeaderProps {
  ticket: Ticket;
  status: TicketStatus;
  isAdmin: boolean;
  onStatusChange: (status: TicketStatus) => void;
}

const TicketHeader = ({ ticket, status, isAdmin, onStatusChange }: TicketHeaderProps) => {
  const { t } = useLanguage();
  
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-500 hover:bg-blue-600";
      case "In Progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Closed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{ticket.project}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-sm">
              {ticket.category}
            </Badge>
            <Badge 
              className={`text-white text-sm ${getStatusColor(status)}`}
            >
              {status}
            </Badge>
          </div>
        </div>
        
        {isAdmin && (
          <div className="mt-4 md:mt-0">
            <div className="text-sm font-medium mb-1">
              {t('ticketDetails.updateStatus')}:
            </div>
            <Select
              value={status}
              onValueChange={(value) => onStatusChange(value as TicketStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('ticketDetails.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500 mb-4">
          <div>{t('ticketDetails.from')}: <span className="font-medium text-gray-700">{ticket.name} ({ticket.email})</span></div>
          <div>{t('ticketDetails.created')}: <span className="font-medium text-gray-700">{format(new Date(ticket.created_at), 'PPP')}</span></div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">{t('ticketDetails.description')}:</h3>
          <div className="text-gray-600 whitespace-pre-line">{ticket.description}</div>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
