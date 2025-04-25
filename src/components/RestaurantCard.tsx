
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RestaurantCardProps {
  image: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
}

const RestaurantCard = ({ image, name, cuisine, rating, priceRange, description }: RestaurantCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{cuisine}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {rating}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="text-sm font-semibold text-primary">{priceRange}</p>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
