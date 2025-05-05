
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import TicketDetail from "@/components/TicketDetail";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }
  }, [id]);

  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      console.log("Fetching ticket detail for ID:", ticketId);
      
      // Fetch ticket data from Supabase
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_user_id_fkey (name, email)
        `)
        .eq('id', ticketId)
        .single();
      
      if (ticketError) {
        throw new Error(`Error fetching ticket: ${ticketError.message}`);
      }
      
      if (!ticketData) {
        setTicket(null);
        setLoading(false);
        return;
      }
      
      console.log("Retrieved ticket data:", ticketData);
      
      // Fetch attachments if any
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from('ticket_attachments')
        .select('*')
        .eq('ticket_id', ticketId);
        
      if (attachmentsError) {
        console.error('Error fetching attachments:', attachmentsError);
      }
      
      // Transform the data to match our Ticket type
      const formattedTicket: Ticket = {
        id: ticketData.id,
        name: ticketData.users.name,
        email: ticketData.users.email,
        project: ticketData.project,
        category: ticketData.category,
        description: ticketData.description,
        status: ticketData.status,
        created_at: ticketData.created_at,
        updated_at: ticketData.updated_at,
        attachments: attachmentsData || []
      };
      
      setTicket(formattedTicket);
    } catch (error: any) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket details", { 
        description: error.message || "Please try again later" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="spybee-container">
            <div className="text-center py-12">{t('ticketDetails.loading')}</div>
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
              <h2 className="text-2xl font-bold mb-4">{t('ticketDetails.notFound')}</h2>
              <p className="mb-6">{t('ticketDetails.notFoundDesc')}</p>
              <Button onClick={() => navigate("/ticket-status")} className="bg-spybee-yellow text-spybee-dark">
                {t('ticketDetails.backToStatus')}
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
              {t('ticketDetails.back')}
            </Button>
            <h1 className="text-3xl font-bold text-spybee-dark">
              {t('ticketDetails.title')}
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
              <p className="text-sm mt-2">{t('index.footer.rights')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketDetails;
