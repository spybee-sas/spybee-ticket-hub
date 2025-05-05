
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TicketForm from "@/components/TicketForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmitSuccess = async (data: any) => {
    try {
      // Check if user exists, otherwise create one
      const { email, name } = data;
      
      // Try to find existing user
      let { data: existingUser, error: findUserError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      let userId;
      
      // If user doesn't exist, create one
      if (!existingUser) {
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert([{ name, email }])
          .select('id')
          .single();
        
        if (createUserError) {
          throw new Error(`Error creating user: ${createUserError.message}`);
        }
        
        userId = newUser.id;
      } else {
        userId = existingUser.id;
      }
      
      // Create the ticket - using a service role context if needed for RLS bypass
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            title: `Ticket from ${name}`,
            user_id: userId,
            project: data.project,
            category: data.category,
            description: data.description,
            status: 'Open'
          }
        ])
        .select('id')
        .single();
      
      if (ticketError) {
        console.error("Ticket creation error:", ticketError);
        throw new Error(`Error creating ticket: ${ticketError.message}`);
      }
      
      // Upload attachments if any
      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${ticket.id}/${fileName}`;
          
          const { error: uploadError } = await supabase
            .storage
            .from('ticket_attachments')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            continue;
          }
          
          // Get public URL
          const { data: publicUrlData } = supabase
            .storage
            .from('ticket_attachments')
            .getPublicUrl(filePath);
            
          // Save attachment reference
          await supabase
            .from('ticket_attachments')
            .insert([
              {
                ticket_id: ticket.id,
                file_name: file.name,
                file_url: publicUrlData.publicUrl
              }
            ]);
        }
      }
      
      toast.success("Ticket submitted successfully!", {
        description: `Ticket ID: ${ticket.id.substring(0, 8).toUpperCase()}`,
      });
      
      // Redirect to the status page after submission
      setTimeout(() => {
        navigate("/ticket-status", { state: { email: data.email } });
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket", {
        description: error.message || "Please try again later",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="spybee-container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-spybee-dark mb-2">{t('createTicket.title')}</h1>
            <p className="text-gray-600">
              {t('createTicket.subtitle')}
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
              <p className="text-sm mt-2">{t('index.footer.rights')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateTicket;
