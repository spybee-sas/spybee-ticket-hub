
import { Ticket } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Draggable } from "react-beautiful-dnd";
import { TicketStatus } from "@/types/ticket";

interface KanbanCardProps {
  ticket: Ticket;
  index: number;
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
}

const KanbanCard = ({ ticket, index, handleStatusChange, navigate }: KanbanCardProps) => {
  return (
    <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${snapshot.isDragging ? 'opacity-75' : ''}`}
        >
          <Card className="shadow-sm hover:shadow transition-all">
            <CardHeader className="p-3 pb-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-500">#{ticket.id}</span>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    ticket.category === "Bug"
                      ? "bg-red-100 text-red-800"
                      : ticket.category === "Complaint"
                      ? "bg-purple-100 text-purple-800"
                      : ticket.category === "Delivery Issue"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ticket.category}
                </span>
              </div>
              <CardTitle className="text-sm mt-1">{ticket.project}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xs text-gray-600 mb-2">
                {ticket.name} • {ticket.email}
              </div>
              <p className="text-sm line-clamp-2 mb-3">
                {ticket.description.substring(0, 100)}
                {ticket.description.length > 100 ? "..." : ""}
              </p>
              <div className="flex justify-between items-center mt-2">
                <Select
                  value={ticket.status}
                  onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                >
                  <SelectTrigger className="h-7 text-xs w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                >
                  View →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
