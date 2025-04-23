
import { Bot, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "Plan a 3-day wellness tour in Los Angeles with vegan restaurants"
  );

  const premadeGuides = [
    {
      title: "LA Vegan Food Tour",
      description: "3-day culinary adventure through the best vegan spots",
      downloadUrl: "#"
    },
    {
      title: "Hollywood & Beverly Hills",
      description: "Eco-friendly tour of iconic LA landmarks",
      downloadUrl: "#"
    }
  ];

  // Rotate through example prompts
  const examples = [
    "Plan a 3-day wellness tour in Los Angeles with vegan restaurants",
    "Discover boutique hotels in Santa Monica with ocean views"
  ];

  const rotateExample = () => {
    const currentIndex = examples.indexOf(placeholder);
    const nextIndex = (currentIndex + 1) % examples.length;
    setPlaceholder(examples[nextIndex]);
  };

  const handleDownload = (guide: typeof premadeGuides[0]) => {
    toast({
      title: "Downloading Guide",
      description: `Starting download for "${guide.title}"...`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Please enter your preferences",
        description: "Tell us what kind of journey you're planning!",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Creating your guide...",
      description: "Our AI is crafting the perfect eco-friendly itinerary for you.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Create Your AI Travel Guide</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Share your preferences, and our AI will create the perfect eco-friendly itinerary for you.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="pl-4 pr-4 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/40 transition-colors"
            onFocus={rotateExample}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90 transition-colors"
        >
          Create My Guide
        </Button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Ready-made Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premadeGuides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{guide.description}</p>
                <Button 
                  variant="outline"
                  onClick={() => handleDownload(guide)}
                  className="w-full"
                >
                  <Download className="mr-2" />
                  Download Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIGuideSection;

