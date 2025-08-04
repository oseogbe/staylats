import { useState } from "react";

import { Heart, Star, MapPin, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    type: "shortlet" | "rental";
    amenities: string[];
    maxGuests: number;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden border-0 shadow transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white ${
            isLiked ? "text-red-500" : "text-neutral-600"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/90 text-neutral-700"
        >
          {property.type === "shortlet" ? "Shortlet" : "Rental"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium mr-2">{property.maxGuests}</span>
            <Star className="h-4 w-4 text-primary fill-current mr-1" />
            <span className="text-sm font-medium">{property.rating}</span>
            <span className="text-sm text-neutral-500 ml-1">
              ({property.reviews})
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-neutral-900">
              ₦{property.price.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500 ml-1">
              {property.type === "shortlet" ? "/ night" : "/ month"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;