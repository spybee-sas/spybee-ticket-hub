
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/admin/LoginForm";
import SignupForm from "@/components/admin/SignupForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  
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
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="signup">
                  <SignupForm />
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
