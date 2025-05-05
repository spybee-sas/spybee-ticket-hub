
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardsProps {
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
}

const StatCards = ({ openTickets, inProgressTickets, closedTickets }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Open Tickets</CardTitle>
          <CardDescription>Awaiting response</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-500">{openTickets}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">In Progress</CardTitle>
          <CardDescription>Currently working</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-amber-500">{inProgressTickets}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Closed Tickets</CardTitle>
          <CardDescription>Resolved</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-500">{closedTickets}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
