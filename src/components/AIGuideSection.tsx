
import { Bot, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAIGuide, fetchPremadeGuides, downloadGuide } from "@/services/guideService";
import { TravelGuide } from "@/models/TravelGuide";
import { useQuery, useMutation } from "@tanstack/react-query";

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const [placeholder, setPlaceholder] = useState<string>(
    "План на выходные в Лос-Анджелесе с веганскими ресторанами"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide | null>(null);

  // Запрос на получение готовых путеводителей
  const { data: premadeGuides = [] } = useQuery({
    queryKey: ['premadeGuides'],
    queryFn: fetchPremadeGuides
  });

  // Мутация для создания AI путеводителя
  const createGuideMutation = useMutation({
    mutationFn: generateAIGuide,
    onSuccess: (data) => {
      setIsGenerating(false);
      if (data) {
        setGeneratedGuide(data);
        toast({
          title: "Путеводитель создан!",
          description: "Ваш персонализированный эко-путеводитель готов.",
        });
      }
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Ошибка создания путеводителя",
        description: "Попробуйте еще раз или измените запрос.",
        variant: "destructive",
      });
    }
  });

  // Мутация для скачивания путеводителя
  const downloadGuideMutation = useMutation({
    mutationFn: downloadGuide,
    onSuccess: (data) => {
      if (data) {
        toast({
          title: "Путеводитель загружается",
          description: `Загружается путеводитель "${data.title}"`,
        });
        
        // Имитация скачивания путеводителя
        // В реальном приложении здесь можно сгенерировать PDF или другой документ
        setTimeout(() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.title.replace(/\s+/g, "-").toLowerCase()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 500);
      }
    },
    onError: () => {
      toast({
        title: "Ошибка загрузки путеводителя",
        description: "Не удалось загрузить путеводитель. Попробуйте позже.",
        variant: "destructive",
      });
    }
  });

  // Примеры запросов для подсказки
  const examples = [
    "План на выходные в Лос-Анджелесе с веганскими ресторанами",
    "Эко-тур по горам Швейцарии на 5 дней",
    "Однодневное путешествие по Токио на общественном транспорте"
  ];

  // Ротация примеров запросов
  const rotateExample = () => {
    const currentIndex = examples.indexOf(placeholder);
    const nextIndex = (currentIndex + 1) % examples.length;
    setPlaceholder(examples[nextIndex]);
  };

  // Функция для скачивания готового путеводителя
  const handleDownload = (guideId: string) => {
    downloadGuideMutation.mutate(guideId);
  };

  // Функция для создания нового путеводителя
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Введите свои пожелания",
        description: "Расскажите, какое путешествие вы планируете!",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    toast({
      title: "Создание вашего путеводителя...",
      description: "Наш ИИ создает идеальный эко-маршрут для вас.",
    });

    createGuideMutation.mutate(prompt);
  };

  // Закрыть сообщение о созданном путеводителе
  const handleCloseGeneratedGuide = () => {
    setGeneratedGuide(null);
    setPrompt("");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Создайте свой AI путеводитель</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Расскажите о своих предпочтениях, и наш ИИ создаст идеальный эко-маршрут для вас.
      </p>
      
      {generatedGuide ? (
        <div className="bg-gray-50 p-6 rounded-xl border border-primary/20 mb-6">
          <h3 className="text-xl font-bold mb-2">{generatedGuide.title}</h3>
          <p className="text-gray-600 mb-4">{generatedGuide.description}</p>
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleDownload(generatedGuide.id!)} 
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" /> Скачать путеводитель
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCloseGeneratedGuide}
            >
              Создать новый
            </Button>
          </div>
        </div>
      ) : (
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
            {isGenerating ? "Создаем ваш путеводитель..." : "Создать путеводитель"}
          </Button>
        </form>
      )}

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Готовые путеводители</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premadeGuides.length > 0 ? (
            premadeGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownload(guide.id!)}
                    className="w-full"
                  >
                    <Download className="mr-2" />
                    Скачать путеводитель
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Веганский тур по Лос-Анджелесу</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">3-дневное кулинарное путешествие по лучшим веганским заведениям</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Скачивание путеводителя",
                        description: "Путеводитель скоро будет готов!",
                      });
                    }}
                    className="w-full"
                  >
                    <Download className="mr-2" />
                    Скачать путеводитель
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Голливуд и Беверли-Хиллз</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Эко-тур по знаковым достопримечательностям Лос-Анджелеса</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Скачивание путеводителя",
                        description: "Путеводитель скоро будет готов!",
                      });
                    }}
                    className="w-full"
                  >
                    <Download className="mr-2" />
                    Скачать путеводитель
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGuideSection;
