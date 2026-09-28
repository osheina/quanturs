import { Bot, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { safeParseGuide } from "@/lib/guideContent";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { generateAIGuide, fetchPremadeGuides, downloadGuide, GuideError, GUIDE_CITIES, type GuideCity, type GuidePace } from "@/services/guideService";
import { TravelGuide } from "@/models/TravelGuide";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";


const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "Vegan restaurants and art galleries"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide | null>(null);
  const [selectedPremadeGuide, setSelectedPremadeGuide] = useState<TravelGuide | null>(null);
  const [isLoadingPremadeGuide, setIsLoadingPremadeGuide] = useState(false);

  const { data: premadeGuides = [], isLoading: isLoadingGuides } = useQuery({
    queryKey: ['premadeGuides'],
    queryFn: fetchPremadeGuides
  });

  const { user } = useAuth();
  const [city, setCity] = useState<GuideCity>("Los Angeles");
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<GuidePace>("balanced");
  const [diet, setDiet] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createGuideMutation = useMutation({
    mutationFn: generateAIGuide,
    onSuccess: (data) => {
      setIsGenerating(false);
      setGeneratedGuide(data);
      toast({ title: "Guide Created!", description: "Your personalized eco-guide is ready." });
    },
    onError: (error: unknown) => {
      setIsGenerating(false);
      const msg = error instanceof GuideError ? error.message : "Could not create your guide. Please try again.";
      setErrorMsg(msg);
      toast({ title: "Guide Creation Error", description: msg, variant: "destructive" });
    },
  });

  const examples = [
    "Vegan restaurants and art galleries",
    "Hikes, farmers markets and secondhand shopping",
    "Sustainable shopping and rooftop views",
    "Wellness, parks and cozy cafes",
  ];

  const rotateExample = () => {
    const currentIndex = examples.indexOf(placeholder);
    const nextIndex = (currentIndex + 1) % examples.length;
    setPlaceholder(examples[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!user) {
      setErrorMsg("Please sign in to create a personalized guide.");
      return;
    }
    if (prompt.length > 500) {
      setErrorMsg("Please keep your description under 500 characters.");
      return;
    }
    setIsGenerating(true);
    createGuideMutation.mutate({ city, days, pace, prompt: prompt.trim(), diet: diet || null, interests: [] });
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
    const content = safeParseGuide(guide.content);
    if (!content) {
      return <p className="mt-4 text-destructive">This guide could not be displayed.</p>;
    }
    return (
      <div className="space-y-6 mt-4">
        {content.summary && <p className="text-muted-foreground">{content.summary}</p>}
        {content.days.map((day, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{day.title}</h3>
            <div className="space-y-4">
              {day.items.map((item, i) => (
                <div key={i} className="border-l-4 border-primary/20 pl-4">
                  <p className="font-semibold text-primary capitalize">{item.time}</p>
                  <p className="text-lg">{item.name}</p>
                  {item.meta && <p className="text-sm text-muted-foreground">{item.meta}</p>}
                  {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                  {item.co2 && <p className="text-xs text-primary mt-1">{item.co2}</p>}
                </div>
              ))}
            </div>
          </Card>
        ))}
        {content.recommendations.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="grid gap-6">
              {content.recommendations.map(([key, values]) => (
                <div key={key}>
                  <h4 className="text-lg font-medium capitalize mb-2">{key}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {values.map((v, i) => <li key={i} className="text-muted-foreground">{v}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
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
            maxLength={500}
            disabled={isGenerating}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value as GuideCity)} disabled={isGenerating}
            className="h-11 rounded-xl border-2 border-primary/20 bg-background px-3 text-foreground">
            {GUIDE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Days" value={days} onChange={(e) => setDays(Number(e.target.value))} disabled={isGenerating}
            className="h-11 rounded-xl border-2 border-primary/20 bg-background px-3 text-foreground">
            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>)}
          </select>
          <select aria-label="Pace" value={pace} onChange={(e) => setPace(e.target.value as GuidePace)} disabled={isGenerating}
            className="h-11 rounded-xl border-2 border-primary/20 bg-background px-3 text-foreground">
            <option value="relaxed">Relaxed pace</option>
            <option value="balanced">Balanced pace</option>
            <option value="packed">Packed pace</option>
          </select>
          <select aria-label="Diet" value={diet} onChange={(e) => setDiet(e.target.value)} disabled={isGenerating}
            className="h-11 rounded-xl border-2 border-primary/20 bg-background px-3 text-foreground">
            <option value="">Any diet</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="gluten-free">Gluten-free</option>
          </select>
        </div>
        {errorMsg && (
          <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMsg}{" "}
            {!user && <Link to="/auth" className="underline font-medium">Sign in</Link>}
          </div>
        )}
        {isGenerating && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Choosing places from our catalog… this can take up to a minute.
          </p>
        )}
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Featured Guides</h3>
          
        </div>
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
              <Card key={guide.id} className="hover:shadow-lg transition-shadow bg-white overflow-hidden">
                {guide.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={guide.image_url} 
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
