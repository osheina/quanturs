
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BadgeDollarSign, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Co2Badge from "./Co2Badge";

interface RestaurantCardProps {
  image: string | null; // Разрешаем null для изображения
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
  location: string;
  co2_kg?: number;
  co2_rating?: number;
}

const getDisplayImage = (imageUrl: string | null | undefined, cuisine: string): string => {
  // Проверяем, что imageUrl существует и является прямой ссылкой на изображение Unsplash
  if (imageUrl && (imageUrl.startsWith('https://images.unsplash.com/') || imageUrl.startsWith('https://source.unsplash.com/'))) {
    // Проверяем, что URL не заканчивается на параметры, которые могут указывать на страницу, а не на изображение
    // Это упрощенная проверка, но должна отсечь большинство HTML-страниц Unsplash
    if (!imageUrl.includes('/photos/')) {
      return imageUrl;
    }
  }
  // Запасное изображение, если основное отсутствует, некорректно или является HTML-страницей
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(cuisine || 'food')},abstract&random=${Math.random()}`;
};

const RestaurantCard = ({ image, name, cuisine, rating, priceRange, description, location, co2_kg, co2_rating }: RestaurantCardProps) => {
  const displayImage = getDisplayImage(image, cuisine);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={displayImage} 
          alt={name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Дополнительный обработчик на случай, если даже fallback-изображение не загрузится
            // или если initiale изображение вызвало ошибку по другой причине
            const target = e.target as HTMLImageElement;
            target.src = `https://source.unsplash.com/400x300/?${encodeURIComponent(cuisine || 'food')},placeholder&random=${Math.random() + 1}`;
            target.alt = `${name} - Image not available`;
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
            <BadgeDollarSign className="w-4 h-4" />
            {priceRange}
          </Badge>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span className="text-sm font-medium">{cuisine}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
          </span>
        </CardDescription>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p> {/* Используем line-clamp для ограничения описания */}
        <Co2Badge co2_kg={co2_kg} co2_rating={co2_rating} />
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
