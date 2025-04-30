
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateTicket from "./pages/CreateTicket";
import TicketStatus from "./pages/TicketStatus";
import TicketDetails from "./pages/TicketDetails";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminTicketDetail from "./pages/admin/TicketDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/ticket-status" element={<TicketStatus />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
