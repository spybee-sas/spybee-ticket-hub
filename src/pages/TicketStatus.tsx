
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTicketsByEmail } from "@/lib/mockData";
import { Ticket } from "@/types/ticket";

const TicketStatus = () => {
  const location = useLocation();
  const [email, setEmail] = useState((location.state as any)?.email || "");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if ((location.state as any)?.email) {
      handleSearch();
    }
  }, [location.state]);

  const handleSearch = () => {
    if (!email) return;
    
    // In a real app, we'd fetch from an API
    const fetchedTickets = getTicketsByEmail(email);
    setTickets(fetchedTickets);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="spybee-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-spybee-dark mb-2">Track Your Tickets</h1>
            <p className="text-gray-600">
              Enter your email address to view the status of all your support tickets.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-spybee-grey-light mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
              />
              <Button 
                className="bg-spybee-yellow hover:bg-amber-400 text-spybee-dark"
                onClick={handleSearch}
              >
                Search Tickets
              </Button>
            </div>
          </div>
          
          {searched && (
            <div>
              {tickets.length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any tickets associated with this email address.
                  </p>
                  <Button
                    onClick={() => window.location.href = "/create-ticket"}
                    variant="outline"
                    className="border-spybee-yellow text-spybee-dark"
                  >
                    Create a New Ticket
                  </Button>
                </div>
              )}
            </div>
          )}
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

export default TicketStatus;
