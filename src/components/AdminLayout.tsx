
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Simulating loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return prev;
        }
        return prev + 10;
      });
    }, 150);

    // Check if user is logged in as admin
    const adminData = localStorage.getItem("spybee_admin");
    
    if (!adminData) {
      setError("Admin session not found");
      toast.error("Please log in to access the admin area");
      navigate("/admin/login");
      setIsLoading(false);
      clearInterval(timer);
      return;
    }
    
    try {
      const admin = JSON.parse(adminData);
      
      // Check if admin session is valid
      if (!admin.isAdmin) {
        throw new Error("Not authorized");
      }
      
      // Check if session is expired (24 hours)
      const currentTime = new Date().getTime();
      const sessionTime = admin.timestamp || 0;
      const sessionAge = currentTime - sessionTime;
      
      // If session is older than 24 hours, consider it expired
      if (sessionAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("spybee_admin");
        throw new Error("Session expired");
      }
      
      // Set up custom headers for API requests
      supabase.functions.setAuth(`admin_session_${admin.id}`);
      
      console.log("Admin session validated:", admin.email);
      setIsAuthorized(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Session expired or invalid";
      setError(errorMessage);
      toast.error("Not authorized or session expired");
      navigate("/admin/login");
    } finally {
      setIsLoading(false);
      clearInterval(timer);
    }

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  if (isLoading) {
    return <LoadingState progress={progress} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!isAuthorized) {
    return null; // Navigate happens in the useEffect
  }

  return <>{children}</>;
};

// Extracted loading component
const LoadingState = ({ progress }: { progress: number }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center">
          <Skeleton className="h-12 w-12 rounded-full bg-spybee-yellow/60 mb-4" />
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-36" />
        </div>
        
        <div className="space-y-2 w-full">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Verifying admin credentials...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted error component
const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="border-red-300">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="mt-2">
            {message}. Redirecting to login page...
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AdminLayout;
