import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const Header = ({
  apiKey,
  setApiKey,
  modelName,
  setModelName,
  systemMessage,
  setSystemMessage,
}: {
  apiKey: string;
  setApiKey: (key: string) => void;
  modelName: string;
  setModelName: (name: string) => void;
  systemMessage: string;
  setSystemMessage: (message: string) => void;
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('reportcraft-api-key', apiKey);
    localStorage.setItem('reportcraft-model-name', modelName);
    localStorage.setItem('reportcraft-system-message', systemMessage);

    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <header className="w-full bg-gradient-to-r from-reportcraft-blue to-reportcraft-red p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">ReportCraft</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
            <Settings className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Configure your ReportCraft settings here.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., gemini-2.0-flash-exp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemMessage">System Message</Label>
              <Input
                id="systemMessage"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="Enter system message"
              />
            </div>
            <Button 
              className="w-full mt-6" 
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};