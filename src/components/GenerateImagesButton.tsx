import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Image } from "lucide-react";

export const GenerateImagesButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Генерация изображений",
        description: "Начинаем генерировать изображения для гайдов...",
      });

      const { data, error } = await supabase.functions.invoke('generate-guide-images', {
        body: {}
      });

      if (error) {
        console.error('Error generating images:', error);
        toast({
          title: "Ошибка",
          description: `Не удалось сгенерировать изображения: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Image generation results:', data);
      
      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      const totalCount = data.results?.length || 0;

      toast({
        title: "Успешно!",
        description: `Сгенерировано ${successCount} из ${totalCount} изображений. Обновите страницу.`,
      });

      // Обновляем страницу через 2 секунды
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error calling function:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при генерации изображений",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateImages}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Генерация...
        </>
      ) : (
        <>
          <Image className="h-4 w-4" />
          Сгенерировать изображения
        </>
      )}
    </Button>
  );
};
