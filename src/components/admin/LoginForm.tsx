
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the correct types for the RPC function
type CheckAdminPasswordParams = {
  admin_email: string;
  admin_password: string;
}

// Define the return type explicitly as boolean
type CheckAdminPasswordResult = boolean;

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Query the admins table to find a matching admin
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, email, name')
        .eq('email', email)
        .single();
      
      if (error) {
        throw new Error('Authentication failed');
      }
      
      // Fix the type parameters for the RPC call
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc<CheckAdminPasswordResult, CheckAdminPasswordParams>('check_admin_password', {
          admin_email: email,
          admin_password: password
        });
      
      if (passwordError || !passwordCheck) {
        throw new Error('Invalid credentials');
      }
      
      // Store admin session in localStorage
      localStorage.setItem("spybee_admin", JSON.stringify({ 
        email: admin.email, 
        name: admin.name,
        id: admin.id,
        isAdmin: true 
      }));
      
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@spybee.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-spybee-dark hover:bg-black text-white"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
