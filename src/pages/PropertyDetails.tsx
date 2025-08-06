import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Star, MapPin, Users, Bed, Bath, Heart, Share, Wifi, Car, Shield, Dumbbell, Waves, Zap, ChefHat, Sparkles, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ShortletBookingCard } from "@/components/booking/ShortletBookingCard";
import { RentalBookingCard } from "@/components/booking/RentalBookingCard";
import { mockProperties } from "@/data/mockData";

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  AC: Zap,
  Pool: Waves,
  Gym: Dumbbell,
  Security: Shield,
  Parking: Car,
  Kitchen: ChefHat,
  Housekeeping: Sparkles,
  "Beach Access": Waves,
  BQ: Home,
  Garden: Home,
  Generator: Zap,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  const property = mockProperties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate("/properties")}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  // Create array of images (using same image multiple times for demo)
  const images = Array(5).fill(property.image);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16/10}>
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {property.type === "shortlet" ? "Shortlet" : "Rental"}
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-primary" />
                      {property.rating} ({property.reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-6 py-4 border-y">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Up to {property.maxGuests} guests</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || Home;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Map Placeholder */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Location</h2>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Map view will be displayed here</p>
                    <p className="text-sm">{property.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            {property.type === "shortlet" ? (
              <ShortletBookingCard
                price={property.price}
                rating={property.rating}
                reviews={property.reviews}
                maxGuests={property.maxGuests}
              />
            ) : (
              <RentalBookingCard
                price={property.price}
                rating={property.rating}
                reviews={property.reviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;