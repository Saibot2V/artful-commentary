import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Landing = () => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('reportcraft-login-pin') || '0609603747';
    
    if (pin === storedPin) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct PIN to continue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-reportcraft-blue">ReportCraft</h1>
          <p className="text-gray-600">Enter PIN to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-64 text-center"
            maxLength={10}
          />
          <Button type="submit" className="w-64">
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Landing;