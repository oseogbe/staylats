import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockProperties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";

const SavedListings = () => {
  const navigate = useNavigate();
  
  // Mock saved properties - in a real app, this would come from state management or API
  const [savedProperties] = useState(mockProperties.slice(0, 3)); // Show first 3 as saved

  const isEmpty = savedProperties.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Saved Listings</h1>
          <p className="text-muted-foreground">
            Save your favorite listings to easily access them later and keep track of your rental options.
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-muted/30 rounded-full p-6 mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Saved listings found!
            </h2>
            
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Head over to the listings and browse properties
            </p>
            
            <Button 
              onClick={() => navigate('/properties')}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          /* Saved Properties Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedListings;