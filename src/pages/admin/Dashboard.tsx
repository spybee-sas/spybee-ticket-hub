
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </CardContent>
          </Card>
          
          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium text-gray-500">ID</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Project</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Category</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Created</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{ticket.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div>{ticket.name}</div>
                            <div className="text-xs text-gray-500">{ticket.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{ticket.project}</td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          No tickets found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
