
import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { generateAIGuide, fetchPremadeGuides } from "@/services/guideService";
import { TravelGuide } from "@/models/TravelGuide";
import { useQuery, useMutation } from "@tanstack/react-query";

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "Weekend plan in Los Angeles with vegan restaurants"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide | null>(null);

  const { data: premadeGuides = [] } = useQuery({
    queryKey: ['premadeGuides'],
    queryFn: fetchPremadeGuides
  });

  const createGuideMutation = useMutation({
    mutationFn: generateAIGuide,
    onSuccess: (data) => {
      setIsGenerating(false);
      if (data) {
        setGeneratedGuide(data);
        toast({
          title: "Guide Created!",
          description: "Your personalized eco-guide is ready.",
        });
      }
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Guide Creation Error",
        description: "Please try again or modify your request.",
        variant: "destructive",
      });
    }
  });

  const examples = [
    "Weekend plan in Los Angeles with vegan restaurants",
    "5-day eco-tour in Swiss Alps",
    "One day in Tokyo using public transport"
  ];

  const rotateExample = () => {
    const currentIndex = examples.indexOf(placeholder);
    const nextIndex = (currentIndex + 1) % examples.length;
    setPlaceholder(examples[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Enter Your Preferences",
        description: "Tell us about the journey you're planning!",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    toast({
      title: "Creating Your Guide...",
      description: "Our AI is crafting the perfect eco-friendly itinerary for you.",
    });

    createGuideMutation.mutate(prompt);
  };

  const handleCloseGeneratedGuide = () => {
    setGeneratedGuide(null);
    setPrompt("");
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
            disabled={isGenerating}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90 transition-colors"
          disabled={isGenerating}
        >
          {isGenerating ? "Creating your guide..." : "Create Guide"}
        </Button>
      </form>

      <Dialog open={generatedGuide !== null} onOpenChange={() => handleCloseGeneratedGuide()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{generatedGuide?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {generatedGuide && JSON.parse(generatedGuide.content).days.map((day: any, index: number) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold mb-4">Day {index + 1}: {day.title}</h3>
                <div className="space-y-4">
                  {day.activities.map((activity: any, actIndex: number) => (
                    <div key={actIndex} className="border-l-4 border-primary/20 pl-4">
                      <p className="font-semibold text-primary">{activity.time}</p>
                      <p className="text-lg">{activity.activity}</p>
                      <p className="text-sm text-gray-600">{activity.location}</p>
                      {activity.notes && (
                        <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            {generatedGuide && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                  <div className="grid gap-6">
                    {Object.entries(JSON.parse(generatedGuide.content).recommendations).map(([key, values]: [string, any]) => (
                      <div key={key}>
                        <h4 className="text-lg font-medium capitalize mb-2">{key}</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {values.map((item: string, index: number) => (
                            <li key={index} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Featured Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h4 className="text-lg font-semibold">Vegan Tour in Los Angeles</h4>
              <p className="text-gray-600 mb-4">3-day culinary journey through the best vegan spots</p>
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Loading Guide",
                    description: "Guide preview coming soon!",
                  });
                }}
                className="w-full"
              >
                Preview Guide
              </Button>
            </div>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h4 className="text-lg font-semibold">Hollywood & Beverly Hills</h4>
              <p className="text-gray-600 mb-4">Eco-friendly tour of LA's iconic landmarks</p>
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Loading Guide",
                    description: "Guide preview coming soon!",
                  });
                }}
                className="w-full"
              >
                Preview Guide
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIGuideSection;
