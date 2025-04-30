
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would be an API call to authenticate
    setTimeout(() => {
      // Mock admin credentials (in a real app, this would be securely checked on the server)
      if (email === "admin@spybee.com" && password === "admin123") {
        // Store admin session in localStorage (in a real app, use proper auth tokens)
        localStorage.setItem("spybee_admin", JSON.stringify({ email, isAdmin: true }));
        
        navigate("/admin/dashboard");
        toast.success("Login successful!");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      
      setIsLoading(false);
    }, 1000);
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
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
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
                
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>For demo purposes:</p>
                  <p>Email: admin@spybee.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
