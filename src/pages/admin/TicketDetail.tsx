
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import TicketDetail from "@/components/TicketDetail";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      console.log("Admin: Fetching ticket detail for ID:", ticketId);
      
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
      
      console.log("Admin: Retrieved ticket data with status:", ticketData.status);
      
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
        attachments: attachmentsData || [],
        user_id: ticketData.user_id
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
      <AdminLayout>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-spybee-dark text-white">
            <div className="spybee-container py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-spybee-yellow rounded-md flex items-center justify-center">
                  <span className="font-bold text-spybee-dark">SB</span>
                </div>
                <h1 className="text-xl font-bold">Spybee Admin</h1>
              </div>
            </div>
          </header>
          
          <main className="spybee-container py-8">
            <div className="text-center py-12">Loading ticket details...</div>
          </main>
        </div>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-spybee-dark text-white">
            <div className="spybee-container py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-spybee-yellow rounded-md flex items-center justify-center">
                  <span className="font-bold text-spybee-dark">SB</span>
                </div>
                <h1 className="text-xl font-bold">Spybee Admin</h1>
              </div>
            </div>
          </header>
          
          <main className="spybee-container py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
              <p className="mb-6">Sorry, we couldn't find the ticket you're looking for.</p>
              <Button onClick={() => navigate("/admin/dashboard")} className="bg-spybee-yellow text-spybee-dark">
                Back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-spybee-dark text-white">
          <div className="spybee-container py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-spybee-yellow rounded-md flex items-center justify-center">
                <span className="font-bold text-spybee-dark">SB</span>
              </div>
              <h1 className="text-xl font-bold">Spybee Admin</h1>
            </div>
          </div>
        </header>
        
        <main className="spybee-container py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="mb-2"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-spybee-dark">
              Ticket Details
            </h1>
          </div>
          
          <TicketDetail ticket={ticket} isAdmin={true} />
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminTicketDetail;
