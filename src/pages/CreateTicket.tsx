
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TicketForm from "@/components/TicketForm";
import { toast } from "sonner";

const CreateTicket = () => {
  const navigate = useNavigate();

  const handleSubmitSuccess = (data: any) => {
    // In a real app, we'd submit to an API here
    console.log("Form submitted with data:", data);
    
    // Redirect to the status page after submission
    setTimeout(() => {
      navigate("/ticket-status", { state: { email: data.email } });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="spybee-container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-spybee-dark mb-2">Create a Support Ticket</h1>
            <p className="text-gray-600">
              Fill out the form below to submit a new support ticket. Our team will respond as soon as possible.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-spybee-grey-light">
            <TicketForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
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

export default CreateTicket;
