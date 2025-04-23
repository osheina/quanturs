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
    "Plan a 3-day wellness retreat in the Swiss Alps with vegan and gluten-free meal options."
  );

  const premadeGuides = [
    {
      title: "Эко-тур по Швейцарским Альпам",
      description: "3-дневный маршрут с веганским питанием",
      downloadUrl: "#"
    },
    {
      title: "Культурный тур по Барселоне",
      description: "Веганские тапас и лучшие места",
      downloadUrl: "#"
    }
  ];

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

  const handleDownload = (guide: typeof premadeGuides[0]) => {
    toast({
      title: "Загрузка гайда",
      description: `Загрузка "${guide.title}" начата...`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Пожалуйста, введите ваши предпочтения",
        description: "Расскажите, какое путешествие вы планируете!",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Создаем ваш гайд...",
      description: "Наш ИИ создает идеальный эко-маршрут для вас.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Создайте свой AI-гайд по путешествиям</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Расскажите о своих предпочтениях, и наш ИИ создаст идеальный эко-маршрут для вас.
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
          Создать мой гайд
        </Button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Готовые гайды</h3>
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
                  Скачать гайд
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
