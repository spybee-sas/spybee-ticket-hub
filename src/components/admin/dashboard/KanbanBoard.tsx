
import { Ticket, TicketStatus } from "@/types/ticket";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  tickets: Ticket[];
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
}

const KanbanBoard = ({ tickets, handleStatusChange, navigate }: KanbanBoardProps) => {
  // Group tickets by status
  const openTickets = tickets.filter(ticket => ticket.status === "Open");
  const inProgressTickets = tickets.filter(ticket => ticket.status === "In Progress");
  const closedTickets = tickets.filter(ticket => ticket.status === "Closed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Open Column */}
      <KanbanColumn
        title="Open"
        tickets={openTickets}
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="blue"
        droppableId="open-column"
      />
      
      {/* In Progress Column */}
      <KanbanColumn
        title="In Progress"
        tickets={inProgressTickets}
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="amber"
        droppableId="in-progress-column"
      />
      
      {/* Closed Column */}
      <KanbanColumn
        title="Closed"
        tickets={closedTickets}
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="green"
        droppableId="closed-column"
      />
    </div>
  );
};

export default KanbanBoard;
