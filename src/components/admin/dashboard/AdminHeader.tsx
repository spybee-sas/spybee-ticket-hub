
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("spybee_admin");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };
  
  return (
    <header className="bg-spybee-dark text-white">
      <div className="spybee-container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/662d8ee9-d27f-45d5-9240-dea291a54943.png" 
              alt="Spybee Logo" 
              className="h-8" 
            />
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
  );
};

export default AdminHeader;
