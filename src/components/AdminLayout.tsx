
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in as admin
    const adminData = localStorage.getItem("spybee_admin");
    
    if (!adminData) {
      toast.error("Please log in to access the admin area");
      navigate("/admin/login");
      return;
    }
    
    try {
      const admin = JSON.parse(adminData);
      if (!admin.isAdmin) {
        throw new Error("Not authorized");
      }
      
      setIsAuthorized(true);
    } catch (error) {
      toast.error("Not authorized or session expired");
      navigate("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Navigate happens in the useEffect
  }

  return <>{children}</>;
};

export default AdminLayout;
