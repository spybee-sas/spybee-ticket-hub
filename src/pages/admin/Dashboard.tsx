
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import { mockTickets } from "@/lib/mockData";
import { Ticket, TicketStatus } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { 
  mapColumnToStatus, 
  getStatusColorClass, 
  getColumnIdFromStatus
} from "@/utils/ticketUtils";
import { handleTicketStatusChange, handleDragEnd } from "@/utils/ticketHelpers";

// Import refactored components
import AdminHeader from "@/components/admin/dashboard/AdminHeader";
import StatCards from "@/components/admin/dashboard/StatCards";
import TicketFilters from "@/components/admin/dashboard/TicketFilters";
import TicketsTable from "@/components/admin/dashboard/TicketsTable";
import KanbanBoard from "@/components/admin/dashboard/KanbanBoard";
import LoadingState from "@/components/admin/dashboard/LoadingState";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [emailDomainFilter, setEmailDomainFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [loading, setLoading] = useState(true);

  // Stats calculations
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;

  // Get unique values for filters
  const projects = Array.from(new Set(tickets.map((t) => t.project)));
  const users = Array.from(new Set(tickets.map((t) => t.name)));
  const emailDomains = Array.from(new Set(tickets.map((t) => {
    const emailParts = t.email.split('@');
    return emailParts.length > 1 ? '@' + emailParts[1] : '';
  }))).filter(domain => domain !== '');

  // Fetch real tickets from Supabase
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_user_id_fkey (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching tickets: ${error.message}`);
      }

      // Transform data to match our Ticket interface
      const formattedTickets: Ticket[] = data.map(ticket => ({
        id: ticket.id,
        name: ticket.users.name,
        email: ticket.users.email,
        project: ticket.project,
        category: ticket.category,
        description: ticket.description,
        status: ticket.status,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        user_id: ticket.user_id,
        title: ticket.title
      }));

      console.log(`Fetched ${formattedTickets.length} tickets from database`);
      setTickets(formattedTickets);
      setFilteredTickets(formattedTickets);
    } catch (error: any) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to load tickets", {
        description: error.message || "Please try again later"
      });
      // Fall back to mock data if fetch fails
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...tickets];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    
    // Apply project filter
    if (projectFilter) {
      if (projectFilter !== "all_projects") {
        result = result.filter((t) => t.project === projectFilter);
      }
    }
    
    // Apply user filter
    if (userFilter) {
      if (userFilter !== "all_users") {
        result = result.filter((t) => t.name === userFilter);
      }
    }
    
    // Apply email domain filter
    if (emailDomainFilter) {
      if (emailDomainFilter !== "all_domains") {
        result = result.filter((t) => t.email.endsWith(emailDomainFilter));
      }
    }
    
    // Apply search filter (search in ticket ID, name, email, and description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.name.toLowerCase().includes(term) ||
          t.email.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredTickets(result);
  }, [statusFilter, projectFilter, userFilter, emailDomainFilter, searchTerm, tickets]);

  // Handle ticket status change
  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    await handleTicketStatusChange(ticketId, newStatus, tickets, setTickets, fetchTickets);
  };

  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    handleDragEnd(result, tickets, mapColumnToStatus, handleStatusChange);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <AdminHeader />
        
        <main className="spybee-container py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <StatCards 
            openTickets={openTickets} 
            inProgressTickets={inProgressTickets} 
            closedTickets={closedTickets} 
          />
          
          {/* Filters */}
          <TicketFilters 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            userFilter={userFilter}
            setUserFilter={setUserFilter}
            emailDomainFilter={emailDomainFilter}
            setEmailDomainFilter={setEmailDomainFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view}
            setView={setView}
            projects={projects}
            users={users}
            emailDomains={emailDomains}
          />
          
          {/* Loading state */}
          {loading && <LoadingState />}
          
          {/* Tickets Views */}
          {!loading && (
            view === "table" ? (
              <TicketsTable 
                tickets={filteredTickets} 
                handleStatusChange={handleStatusChange} 
                navigate={navigate} 
              />
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <KanbanBoard 
                  tickets={filteredTickets} 
                  handleStatusChange={handleStatusChange} 
                  navigate={navigate}
                />
              </DragDropContext>
            )
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
