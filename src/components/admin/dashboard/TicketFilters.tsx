
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface TicketFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  projectFilter: string;
  setProjectFilter: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  emailDomainFilter: string;
  setEmailDomainFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  view: "table" | "kanban";
  setView: (value: "table" | "kanban") => void;
  projects: string[];
  users: string[];
  emailDomains: string[];
}

const TicketFilters = ({
  statusFilter,
  setStatusFilter,
  projectFilter,
  setProjectFilter,
  userFilter,
  setUserFilter,
  emailDomainFilter,
  setEmailDomainFilter,
  searchTerm,
  setSearchTerm,
  view,
  setView,
  projects,
  users,
  emailDomains
}: TicketFiltersProps) => {
  
  const clearAllFilters = () => {
    setStatusFilter("all");
    setProjectFilter("");
    setUserFilter("");
    setEmailDomainFilter("");
    setSearchTerm("");
    toast.success("All filters cleared");
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Filter Tickets</CardTitle>
          <CardDescription>Use multiple filters to narrow down results</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAllFilters}
          className="flex items-center gap-1"
        >
          <Filter className="w-4 h-4" />
          Clear Filters
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <label className="text-sm font-medium block mb-2">Project</label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_projects">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">User</label>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_users">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Email Domain</label>
            <Select value={emailDomainFilter} onValueChange={setEmailDomainFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by email domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_domains">All Domains</SelectItem>
                {emailDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Search</label>
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">View</label>
            <Tabs 
              defaultValue={view} 
              onValueChange={(v) => setView(v as "table" | "kanban")} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketFilters;
