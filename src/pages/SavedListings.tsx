import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/PropertyCard";

import { useSavedListings } from "@/hooks/use-saved-listings";
import { toPropertyCardData } from "@/lib/listingHelpers";

const SavedListings = () => {
  const navigate = useNavigate();
  const { data: savedListings = [], isLoading } = useSavedListings();

  const savedProperties = useMemo(
    () => savedListings.map(toPropertyCardData),
    [savedListings]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Same container as the home page's featured properties */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Favourites</h1>
          <p className="text-muted-foreground">
            Save your favorite listings to easily access them later and keep track of your rental options.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow">
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : savedProperties.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-muted/30 rounded-full p-6 mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No favourites found!
            </h2>

            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Tap the heart on any listing to save it here.
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
