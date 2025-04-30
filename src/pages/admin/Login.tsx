
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the parameter types for the RPC function
interface CheckAdminPasswordParams {
  admin_email: string;
  admin_password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

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
      
      // Check password using a separate query with pgcrypto
      // Fix: Let TypeScript infer the types based on the parameters
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc('check_admin_password', {
          admin_email: email,
          admin_password: password
        } as CheckAdminPasswordParams);
      
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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="border border-spybee-grey-light">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-spybee-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-bold text-lg text-spybee-dark">SB</span>
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
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
                </TabsContent>
                
                <TabsContent value="signup">
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
