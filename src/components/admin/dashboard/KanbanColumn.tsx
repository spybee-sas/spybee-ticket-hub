
import { Ticket, TicketStatus } from "@/types/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droppable } from "react-beautiful-dnd";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  tickets: Ticket[];
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
  columnColor: "blue" | "amber" | "green";
  droppableId: string;
}

const KanbanColumn = ({
  title,
  tickets,
  handleStatusChange,
  navigate,
  columnColor,
  droppableId
}: KanbanColumnProps) => {
  return (
    <Card className="h-full">
      <CardHeader className={`bg-${columnColor}-50 border-b border-${columnColor}-100`}>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className={`bg-${columnColor}-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full`}>
            {tickets.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 max-h-[600px] overflow-y-auto">
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 min-h-[50px]"
            >
              {tickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tickets in this column
                </div>
              ) : (
                tickets.map((ticket, index) => (
                  <KanbanCard
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    handleStatusChange={handleStatusChange}
                    navigate={navigate}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
