
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignupForm = () => {
  const navigate = useNavigate();
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!signupEmail || !signupPassword || !signupName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Validate email domain
    if (!signupEmail.endsWith('@spybee.com.co')) {
      toast.error("Only @spybee.com.co email addresses are allowed");
      return;
    }
    
    setIsSigningUp(true);
    
    try {
      // Check if admin already exists
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .eq('email', signupEmail)
        .maybeSingle();
        
      if (existingAdmin) {
        toast.error("An account with this email already exists");
        setIsSigningUp(false);
        return;
      }
      
      // Create new admin record
      const { data, error } = await supabase
        .from('admins')
        .insert([
          { 
            name: signupName, 
            email: signupEmail, 
            password_hash: signupPassword // This will be hashed by the database trigger
          }
        ])
        .select('id, email, name');
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Account created successfully!");
      
      // Auto login after signup
      if (data && data.length > 0) {
        localStorage.setItem("spybee_admin", JSON.stringify({ 
          email: data[0].email, 
          name: data[0].name,
          id: data[0].id,
          isAdmin: true 
        }));
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="signupName" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="signupName"
          type="text"
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)}
          placeholder="Juan Pérez"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signupEmail" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="signupEmail"
          type="email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          placeholder="admin@spybee.com.co"
          required
        />
        <p className="text-xs text-gray-500">Only @spybee.com.co emails are allowed</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signupPassword" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="signupPassword"
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-spybee-dark hover:bg-black text-white"
        disabled={isSigningUp}
      >
        {isSigningUp ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
