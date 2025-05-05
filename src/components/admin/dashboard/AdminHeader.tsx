
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
  );
};

export default AdminHeader;
