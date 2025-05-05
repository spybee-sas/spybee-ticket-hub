
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

// Define the correct interface for the RPC function result
interface CheckAdminPasswordResult {
  result: boolean;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('login.emptyFields'));
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
      
      // Call the RPC function to check password
      const { data, error: passwordError } = await supabase
        .rpc('check_admin_password', {
          admin_email: email,
          admin_password: password
        });
      
      // Properly handle the RPC result
      if (passwordError || !data) {
        throw new Error('Invalid credentials');
      }
      
      // Correctly cast and check the result
      const passwordCheck = data as CheckAdminPasswordResult;
      
      if (!passwordCheck.result) {
        throw new Error('Invalid credentials');
      }
      
      // Store admin session in localStorage
      localStorage.setItem("spybee_admin", JSON.stringify({ 
        email: admin.email, 
        name: admin.name,
        id: admin.id,
        isAdmin: true 
      }));
      
      toast.success(t('login.success'));
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('login.email')}
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
          {t('login.password')}
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
        {isLoading ? t('login.logging') : t('login.button')}
      </Button>
    </form>
  );
};

export default LoginForm;
