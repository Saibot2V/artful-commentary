import { useState } from "react";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { MessageInput } from "@/components/MessageInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ImageWithPoints } from "@/components/ImageWithPoints";
import { analyzeImage } from "@/services/imageAnalysis";

interface Point {
  point: [number, number];
  label: string;
}

const Index = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('reportcraft-api-key') || "");
  const [modelName, setModelName] = useState(() => localStorage.getItem('reportcraft-model-name') || "gemini-2.0-flash-exp");
  const [systemMessage, setSystemMessage] = useState(() => localStorage.getItem('reportcraft-system-message') || "");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPointMode, setIsPointMode] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setResponse(null);
      setPoints([]);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedImage) {
      toast({
        title: "Image Required",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeImage(
        apiKey,
        modelName,
        systemMessage,
        uploadedImage,
        message,
        isPointMode
      );

      setResponse(result.answer);
      setPoints(result.points || []);
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        apiKey={apiKey}
        setApiKey={setApiKey}
        modelName={modelName}
        setModelName={setModelName}
        systemMessage={systemMessage}
        setSystemMessage={setSystemMessage}
      />
      
      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Response</h2>
            {response ? (
              <div className="prose max-w-none">
                <p>{response}</p>
              </div>
            ) : (
              <p className="text-gray-500">
                Upload an image and send a message to get started.
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            {uploadedImage ? (
              <div className="relative">
                {points.length > 0 ? (
                  <ImageWithPoints imageSrc={uploadedImage} points={points} />
                ) : (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full rounded-lg"
                  />
                )}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setUploadedImage(null)}
                  >
                    Remove Image
                  </Button>
                  <Button
                    variant={isPointMode ? "default" : "outline"}
                    onClick={() => setIsPointMode(!isPointMode)}
                  >
                    {isPointMode ? "Ask and Point Mode" : "Normal Mode"}
                  </Button>
                </div>
              </div>
            ) : (
              <ImageUpload onImageUpload={handleImageUpload} />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t bg-white p-4">
        <div className="container mx-auto">
          <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;