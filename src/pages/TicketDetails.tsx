
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import TicketDetail from "@/components/TicketDetail";
import { Button } from "@/components/ui/button";
import { getTicketById } from "@/lib/mockData";
import { Ticket } from "@/types/ticket";

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, we'd fetch from an API
      const fetchedTicket = getTicketById(id);
      
      if (fetchedTicket) {
        setTicket(fetchedTicket);
      }
      
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="spybee-container">
            <div className="text-center py-12">Loading ticket details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="spybee-container">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
              <p className="mb-6">Sorry, we couldn't find the ticket you're looking for.</p>
              <Button onClick={() => navigate("/ticket-status")} className="bg-spybee-yellow text-spybee-dark">
                Back to Ticket Status
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="spybee-container max-w-4xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/ticket-status")}
              className="mb-2"
            >
              ← Back to tickets
            </Button>
            <h1 className="text-3xl font-bold text-spybee-dark">
              Ticket Details
            </h1>
          </div>
          
          <TicketDetail ticket={ticket} />
        </div>
      </main>
      
      <footer className="bg-spybee-dark text-white py-8">
        <div className="spybee-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-spybee-yellow rounded-md flex items-center justify-center">
                  <span className="font-bold text-xs text-spybee-dark">SB</span>
                </div>
                <span className="font-bold">Spybee Support</span>
              </div>
              <p className="text-sm mt-2">© {new Date().getFullYear()} Spybee. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketDetails;
