import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { generateAIGuide, fetchPremadeGuides, downloadGuide } from "@/services/guideService";
import { TravelGuide } from "@/models/TravelGuide";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "5 days in Los Angeles with vegan food"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide | null>(null);
  const [selectedPremadeGuide, setSelectedPremadeGuide] = useState<TravelGuide | null>(null);
  const [isLoadingPremadeGuide, setIsLoadingPremadeGuide] = useState(false);

  const { data: premadeGuides = [], isLoading: isLoadingGuides } = useQuery({
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
    "Weekend in Los Angeles with vegan restaurants",
    "5 days in California for eco-tourism",
    "3 days in LA for sustainable shopping",
    "3-day eco-tour in San Francisco"
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

    createGuideMutation.mutate(prompt, {
      onError: (error: any) => {
        setIsGenerating(false);
        toast({
          title: "Region Not Supported",
          description: error?.message || "Only Los Angeles and California are supported at the moment.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCloseGeneratedGuide = () => {
    setGeneratedGuide(null);
    setPrompt("");
  };

  const handleClosePremadeGuide = () => {
    setSelectedPremadeGuide(null);
  };

  const handlePreviewGuide = async (guideId: string) => {
    try {
      setIsLoadingPremadeGuide(true);
      const guide = premadeGuides.find(g => g.id === guideId);
      
      if (guide) {
        setSelectedPremadeGuide(guide);
      } else {
        const downloadedGuide = await downloadGuide(guideId);
        if (downloadedGuide) {
          setSelectedPremadeGuide(downloadedGuide);
        } else {
          throw new Error("Guide not found");
        }
      }
    } catch (error) {
      console.error("Error loading guide:", error);
      toast({
        title: "Error Loading Guide",
        description: "Could not load the selected guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPremadeGuide(false);
    }
  };

  const renderGuideContent = (guide: TravelGuide) => {
    const content = JSON.parse(guide.content);
    return (
      <div className="space-y-6 mt-4">
        {content.days?.map((day: any, index: number) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{day.title}</h3>
            <div className="space-y-4">
              {day.activities?.map((activity: any, actIndex: number) => (
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
        {content.recommendations && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <div className="grid gap-6">
                {Object.entries(content.recommendations).map(([key, values]: [string, any]) => (
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
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Create Your AI Travel Guide</h2>
      </div>
      
      <p className="text-gray-700 mb-6">
        Share your preferences, and our AI will create the perfect eco-friendly itinerary for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="pl-4 pr-4 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/40 transition-colors bg-white text-gray-900"
            onFocus={rotateExample}
            disabled={isGenerating}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90 transition-colors text-white"
          disabled={isGenerating}
        >
          {isGenerating ? "Creating your guide..." : "Create Guide"}
        </Button>
      </form>

      {/* Dialog for generated AI guide */}
      <Dialog open={generatedGuide !== null} onOpenChange={handleCloseGeneratedGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">{generatedGuide?.title}</DialogTitle>
          </DialogHeader>
          {generatedGuide && renderGuideContent(generatedGuide)}
        </DialogContent>
      </Dialog>

      {/* Dialog for premade guide preview */}
      <Dialog open={selectedPremadeGuide !== null} onOpenChange={handleClosePremadeGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">{selectedPremadeGuide?.title}</DialogTitle>
          </DialogHeader>
          {selectedPremadeGuide && renderGuideContent(selectedPremadeGuide)}
        </DialogContent>
      </Dialog>

      {/* Featured Guides Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Featured Guides</h3>
        {isLoadingGuides ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-white">
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : premadeGuides.length === 0 ? (
          <Card className="p-6 text-center bg-white">
            <p className="text-gray-700">No featured guides available at the moment.</p>
            <p className="text-sm text-gray-600 mt-2">Try creating a custom guide above!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premadeGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow bg-white">
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900">{guide.title}</h4>
                  <p className="text-gray-700 mb-4 line-clamp-2">{guide.description}</p>
                  <Button 
                    variant="outline"
                    onClick={() => handlePreviewGuide(guide.id || "")}
                    className="w-full text-gray-900"
                    disabled={isLoadingPremadeGuide}
                  >
                    {isLoadingPremadeGuide ? "Loading..." : "Preview Guide"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGuideSection;
