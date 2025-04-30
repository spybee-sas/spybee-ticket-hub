
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { mockTickets } from "@/lib/mockData";
import { Ticket, TicketStatus } from "@/types/ticket";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [view, setView] = useState<"table" | "kanban">("table");

  // Stats
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;

  // Get unique projects for filter
  const projects = Array.from(new Set(tickets.map((t) => t.project)));

  useEffect(() => {
    let result = [...tickets];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    
    // Apply project filter
    if (projectFilter) {
      result = result.filter((t) => t.project === projectFilter);
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
  }, [statusFilter, projectFilter, searchTerm, tickets]);

  const handleLogout = () => {
    localStorage.removeItem("spybee_admin");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );
    
    setTickets(updatedTickets);
    toast.success(`Ticket ${ticketId} status updated to ${newStatus}`);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <header className="bg-spybee-dark text-white">
          <div className="spybee-container py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-spybee-yellow rounded-md flex items-center justify-center">
                  <span className="font-bold text-spybee-dark">SB</span>
                </div>
                <h1 className="text-xl font-bold">Spybee Admin</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span>Admin</span>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-spybee-dark"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="spybee-container py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
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
          
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Status
                  </label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Project
                  </label>
                  <Select
                    value={projectFilter}
                    onValueChange={setProjectFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Search
                  </label>
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    View
                  </label>
                  <Tabs defaultValue={view} onValueChange={(v) => setView(v as "table" | "kanban")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="table">Table</TabsTrigger>
                      <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tickets Views */}
          {view === "table" ? (
            <TicketsTable 
              tickets={filteredTickets} 
              handleStatusChange={handleStatusChange} 
              navigate={navigate} 
            />
          ) : (
            <KanbanBoard 
              tickets={filteredTickets} 
              handleStatusChange={handleStatusChange} 
              navigate={navigate}
            />
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

// Tickets Table Component
const TicketsTable = ({ 
  tickets, 
  handleStatusChange, 
  navigate 
}: { 
  tickets: Ticket[]; 
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tickets</CardTitle>
        <CardDescription>
          {tickets.length} tickets found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{ticket.name}</div>
                    <div className="text-xs text-gray-500">{ticket.email}</div>
                  </div>
                </TableCell>
                <TableCell>{ticket.project}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      ticket.category === "Bug"
                        ? "bg-red-100 text-red-800"
                        : ticket.category === "Complaint"
                        ? "bg-purple-100 text-purple-800"
                        : ticket.category === "Delivery Issue"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.category}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                  >
                    <SelectTrigger className="h-8 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No tickets found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Kanban Board Component
const KanbanBoard = ({ 
  tickets, 
  handleStatusChange, 
  navigate 
}: { 
  tickets: Ticket[]; 
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
}) => {
  // Group tickets by status
  const openTickets = tickets.filter(ticket => ticket.status === "Open");
  const inProgressTickets = tickets.filter(ticket => ticket.status === "In Progress");
  const closedTickets = tickets.filter(ticket => ticket.status === "Closed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Open Column */}
      <KanbanColumn 
        title="Open" 
        tickets={openTickets} 
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="blue"
      />
      
      {/* In Progress Column */}
      <KanbanColumn 
        title="In Progress" 
        tickets={inProgressTickets} 
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="amber"
      />
      
      {/* Closed Column */}
      <KanbanColumn 
        title="Closed" 
        tickets={closedTickets} 
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        columnColor="green"
      />
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ 
  title, 
  tickets, 
  handleStatusChange, 
  navigate,
  columnColor
}: { 
  title: string; 
  tickets: Ticket[]; 
  handleStatusChange: (id: string, status: TicketStatus) => void;
  navigate: (path: string) => void;
  columnColor: "blue" | "amber" | "green";
}) => {
  return (
    <Card className="h-full">
      <CardHeader className={`bg-${columnColor}-50 border-b border-${columnColor}-100`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className={`bg-${columnColor}-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full`}>
            {tickets.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 max-h-[600px] overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets in this column
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="shadow-sm hover:shadow transition-all">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-gray-500">#{ticket.id}</span>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        ticket.category === "Bug"
                          ? "bg-red-100 text-red-800"
                          : ticket.category === "Complaint"
                          ? "bg-purple-100 text-purple-800"
                          : ticket.category === "Delivery Issue"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.category}
                    </span>
                  </div>
                  <CardTitle className="text-sm mt-1">{ticket.project}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xs text-gray-600 mb-2">
                    {ticket.name} • {ticket.email}
                  </div>
                  <p className="text-sm line-clamp-2 mb-3">
                    {ticket.description.substring(0, 100)}
                    {ticket.description.length > 100 ? "..." : ""}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Select
                      value={ticket.status}
                      onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                    >
                      <SelectTrigger className="h-7 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                    >
                      View →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
