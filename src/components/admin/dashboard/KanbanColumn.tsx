
import { Ticket, TicketStatus } from "@/types/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droppable } from "react-beautiful-dnd";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  tickets: Ticket[];
  handleStatusChange: (id: string, status: TicketStatus) => Promise<boolean>;
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
  // Map color names to Tailwind classes
  const colorClasses = {
    blue: {
      header: "bg-blue-50 border-blue-100",
      badge: "bg-blue-500 text-white"
    },
    amber: {
      header: "bg-amber-50 border-amber-100",
      badge: "bg-amber-500 text-white"
    },
    green: {
      header: "bg-green-50 border-green-100",
      badge: "bg-green-500 text-white"
    }
  };

  const { header, badge } = colorClasses[columnColor];

  return (
    <Card className="h-full">
      <CardHeader className={`${header} border-b`}>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className={`${badge} text-sm font-semibold px-2.5 py-0.5 rounded-full`}>
            {tickets.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 max-h-[600px] overflow-y-auto">
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-3 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-gray-50 rounded-md p-2' : ''}`}
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
