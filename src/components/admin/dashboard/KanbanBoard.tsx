
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

  // Update local tickets when parent tickets change, but only if not processing a drag
  useEffect(() => {
    if (!processingDrag) {
      setLocalTickets(tickets);
    }
  }, [tickets, processingDrag]);

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
      
      // Preserve the original ticket for potential rollback
      const originalTicket = tickets.find(t => t.id === draggableId);
      const originalStatus = originalTicket?.status;
      
      // First, update local state optimistically for a responsive UI
      const updatedTickets = localTickets.map(ticket => 
        ticket.id === draggableId ? { ...ticket, status: newStatus } : ticket
      );
      setLocalTickets(updatedTickets);
      
      try {
        // Then update the backend
        const success = await handleStatusChange(draggableId, newStatus);
        
        // Only revert the local state if the backend update explicitly failed
        if (!success && originalStatus) {
          console.log(`Status update failed, reverting to original status: ${originalStatus}`);
          const revertedTickets = localTickets.map(ticket => 
            ticket.id === draggableId ? { ...ticket, status: originalStatus } : ticket
          );
          setLocalTickets(revertedTickets);
        }
      } catch (error) {
        console.error("Error during status change:", error);
        // Revert on error
        if (originalStatus) {
          const revertedTickets = localTickets.map(ticket => 
            ticket.id === draggableId ? { ...ticket, status: originalStatus } : ticket
          );
          setLocalTickets(revertedTickets);
        }
      } finally {
        // Clear the processing state after a short delay to prevent immediate overwrite from parent props
        setTimeout(() => {
          setProcessingDrag(false);
        }, 1500); // Increased delay for better reliability
      }
    }
  };

  if (isRefreshing && !processingDrag) {
    return <LoadingState message="Updating board..." />;
  }

  // Ensure that droppable IDs are consistent with the ones in mapColumnToStatus
  const columnIds = {
    open: "open-column",
    inProgress: "in-progress-column",
    closed: "closed-column"
  };

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
          droppableId={columnIds.open}
        />
        
        {/* In Progress Column */}
        <KanbanColumn
          title="In Progress"
          tickets={inProgressTickets}
          handleStatusChange={handleStatusChange}
          navigate={navigate}
          columnColor="amber"
          droppableId={columnIds.inProgress}
        />
        
        {/* Closed Column */}
        <KanbanColumn
          title="Closed"
          tickets={closedTickets}
          handleStatusChange={handleStatusChange}
          navigate={navigate}
          columnColor="green"
          droppableId={columnIds.closed}
        />
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
