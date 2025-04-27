
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BadgeDollarSign, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  image: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
  location: string;
}

const RestaurantCard = ({ image, name, cuisine, rating, priceRange, description, location }: RestaurantCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
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
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
