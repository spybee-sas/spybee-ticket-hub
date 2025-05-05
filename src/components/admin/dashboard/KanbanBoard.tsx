
import { Ticket, TicketStatus } from "@/types/ticket";
import KanbanColumn from "./KanbanColumn";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { mapColumnToStatus } from "@/utils/ticketUtils";
import { useEffect, useState } from "react";
import LoadingState from "./LoadingState";

interface KanbanBoardProps {
  tickets: Ticket[];
  handleStatusChange: (id: string, status: TicketStatus) => Promise<boolean>;
  navigate: (path: string) => void;
  isRefreshing?: boolean;
}

const KanbanBoard = ({ 
  tickets, 
  handleStatusChange, 
  navigate, 
  isRefreshing = false 
}: KanbanBoardProps) => {
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  const [processingDrag, setProcessingDrag] = useState(false);

  // Update local tickets when parent tickets change
  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  // Group tickets by status
  const openTickets = localTickets.filter(ticket => ticket.status === "Open");
  const inProgressTickets = localTickets.filter(ticket => ticket.status === "In Progress");
  const closedTickets = localTickets.filter(ticket => ticket.status === "Closed");

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area or dropped in the same place
    if (!destination || 
        (source.droppableId === destination.droppableId && 
        source.index === destination.index)) {
      return;
    }
    
    // Get the new status based on destination column
    const newStatus = mapColumnToStatus(destination.droppableId);
    
    if (newStatus) {
      setProcessingDrag(true);
      console.log(`Drag-and-drop: Changing ticket ${draggableId} status to ${newStatus}`);
      
      // First, update local state optimistically for a responsive UI
      const updatedTickets = localTickets.map(ticket => 
        ticket.id === draggableId ? { ...ticket, status: newStatus } : ticket
      );
      setLocalTickets(updatedTickets);
      
      // Then update the backend
      const success = await handleStatusChange(draggableId, newStatus);
      
      // If the backend update failed, revert the local state
      if (!success) {
        setLocalTickets(tickets); // Revert to original tickets
      }
      
      setProcessingDrag(false);
    }
  };

  if (isRefreshing || processingDrag) {
    return <LoadingState message="Updating board..." />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
    </DragDropContext>
  );
};

export default KanbanBoard;
