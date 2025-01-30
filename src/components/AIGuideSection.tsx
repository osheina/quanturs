import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "Plan a 3-day wellness retreat in the Swiss Alps with vegan and gluten-free meal options."
  );

  // Rotate through example prompts
  const examples = [
    "Plan a 3-day wellness retreat in the Swiss Alps with vegan and gluten-free meal options.",
    "Discover boutique hotels in Barcelona with vegan tapas recommendations."
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
        title: "Please enter your travel preferences",
        description: "Tell us what kind of trip you're looking for!",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Generating your guide...",
      description: "Our AI is crafting the perfect sustainable travel itinerary for you.",
    });
    // Here you would typically make an API call to generate the guide
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Create Your AI-Powered Travel Guide</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Tell us your preferences, and our AI will craft the perfect sustainable travel itinerary for you.
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
          Generate My Guide
        </Button>
      </form>
    </div>
  );
};

export default AIGuideSection;