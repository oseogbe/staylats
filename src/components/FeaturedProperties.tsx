import { useMemo } from "react";
import { Link } from "react-router-dom";

import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useActiveListings } from "@/hooks/use-listings";
import type { ActiveListing } from "@/services/listings";

/** Maps a rental pricing key (e.g. "yearly") to a display label */
const PRICING_LABELS: Record<string, string> = {
  daily: "/ day",
  weekly: "/ week",
  monthly: "/ month",
  quarterly: "/ quarter",
  biannual: "/ 6 months",
  yearly: "/ year",
  biennial: "/ 2 years",
};

/** Map an API ActiveListing to the shape PropertyCard expects */
function toPropertyCardData(listing: ActiveListing) {
  const maxGuests =
    (listing.maxOccupants?.adults ?? 0) +
    (listing.maxOccupants?.kids ?? 0) +
    (listing.maxOccupants?.infants ?? 0);

  let price = 0;
  let priceLabel: string | undefined;

  if (listing.type === "shortlet") {
    price = listing.shortletInfo?.pricePerNight ?? 0;
    priceLabel = "/ night";
  } else {
    const pricing = listing.rentalInfo?.pricing;
    if (pricing && Object.keys(pricing).length > 0) {
      const [lowestKey, lowestValue] = Object.entries(pricing).reduce(
        (best, cur) => (Number(cur[1]) < Number(best[1]) ? cur : best)
      );
      price = Number(lowestValue);
      priceLabel = PRICING_LABELS[lowestKey.toLowerCase()] ?? `/ ${lowestKey}`;
    }
  }

  return {
    id: listing.id,
    title: listing.title,
    slug: listing.slug,
    location: `${listing.city}, ${listing.state}`,
    price,
    priceLabel,
    rating: 0,
    reviews: 0,
    image: listing.images?.[0] ?? "",
    type: listing.type,
    amenities: listing.amenities ?? [],
    maxGuests: maxGuests || 1,
  };
}

const FeaturedProperties = () => {
  const { data: activeListings = [], isLoading } = useActiveListings(6);

  const featuredProperties = useMemo(
    () => activeListings.slice(0, 9).map(toPropertyCardData),
    [activeListings]
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start md:items-center justify-between md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-neutral-600 hidden md:block">
              Hand-picked properties with excellent reviews and great amenities
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline">View All Properties</Button>
          </Link>
        </div>

        <p className="text-xl text-neutral-600 md:hidden mb-12">
          Hand-picked properties with excellent reviews and great amenities
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow">
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))
          ) : featuredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600 text-lg">
                No featured properties available yet.
              </p>
              <p className="text-neutral-500 text-sm mt-1">
                Check back soon for new listings!
              </p>
            </div>
          ) : (
            featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
