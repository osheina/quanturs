
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BadgeDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <BadgeDollarSign className="w-4 h-4" />
            {priceRange}
          </Badge>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>{cuisine}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {rating}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;

