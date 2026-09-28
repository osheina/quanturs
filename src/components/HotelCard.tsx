
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Co2Badge from "./Co2Badge"; // Импортируем новый компонент

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  ecoScore: number;
  price: number;
  co2_kg?: number; // Добавляем опциональное поле
  co2_rating?: number; // Добавляем опциональное поле
}

const HotelCard = ({ image, name, location, ecoScore, price, co2_kg, co2_rating }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden rounded-sm border-border bg-card shadow-none transition-shadow duration-300 hover:shadow-[var(--shadow-editorial)]">
      <CardContent className="p-0 relative">
        <img src={image} alt={name} className="w-full h-56 object-cover" />
        <div className="absolute top-3 right-3 bg-card text-foreground px-2 py-1 rounded-sm text-sm flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          {ecoScore}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{location}</p>
        <p className="mt-2 font-bold">${price} <span className="text-sm font-normal text-muted-foreground">per night</span></p>
        <Co2Badge co2_kg={co2_kg} co2_rating={co2_rating} /> {/* Используем новый компонент */}
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
