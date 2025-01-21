import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  ecoScore: number;
  price: number;
}

const HotelCard = ({ image, name, location, ecoScore, price }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          {ecoScore}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="mt-2 font-bold">${price} <span className="text-sm font-normal text-gray-600">per night</span></p>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;