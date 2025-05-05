
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const TicketStatus = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [email, setEmail] = useState((location.state as any)?.email || "");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((location.state as any)?.email) {
      handleSearch();
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Searching tickets for email:", email);
      
      // First find the user
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email);
      
      if (userError) {
        throw new Error(`Error finding user: ${userError.message}`);
      }
      
      if (!users || users.length === 0) {
        // No tickets found for this email
        setTickets([]);
        setSearched(true);
        setLoading(false);
        return;
      }
      
      // Get all user IDs from the search results
      const userIds = users.map(user => user.id);
      
      // Now get all tickets for these users
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_user_id_fkey (name, email)
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false });
      
      if (ticketsError) {
        throw new Error(`Error finding tickets: ${ticketsError.message}`);
      }
      
      console.log("Retrieved tickets:", ticketsData);
      
      // Transform the data to match our Ticket type
      const formattedTickets: Ticket[] = ticketsData.map(ticket => ({
        id: ticket.id,
        name: ticket.users.name,
        email: ticket.users.email,
        project: ticket.project,
        category: ticket.category,
        description: ticket.description,
        status: ticket.status,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));
      
      setTickets(formattedTickets);
      
    } catch (error: any) {
      console.error("Error searching tickets:", error);
      toast.error("Failed to search for tickets", { 
        description: error.message || "Please try again later" 
      });
      setTickets([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="spybee-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-spybee-dark mb-2">{t('tickets.title')}</h1>
            <p className="text-gray-600">
              {t('tickets.subtitle')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-spybee-grey-light mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder={t('tickets.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
              />
              <Button 
                className="bg-spybee-yellow hover:bg-amber-400 text-spybee-dark"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? t('tickets.searching') : t('tickets.search')}
              </Button>
            </div>
          </div>
          
          {searched && (
            <div>
              {tickets.length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t('tickets.yourTickets')}</h2>
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
                  <h3 className="text-lg font-medium mb-2">{t('tickets.noTickets')}</h3>
                  <p className="text-gray-500 mb-4">
                    {t('tickets.noTicketsDesc')}
                  </p>
                  <Button
                    onClick={() => window.location.href = "/create-ticket"}
                    variant="outline"
                    className="border-spybee-yellow text-spybee-dark"
                  >
                    {t('tickets.createNew')}
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
              <p className="text-sm mt-2">
                {t('index.footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketStatus;
