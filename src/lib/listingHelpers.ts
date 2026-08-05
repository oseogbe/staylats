/**
 * The fields a listing needs to render as a card. Both the public
 * `ActiveListing` and the host's own `UserListing` satisfy it, so the summary
 * shown on the home page and in the host's listings stays identical.
 */
export interface ListingCardSource {
  id: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  type: "shortlet" | "rental";
  images?: string[];
  amenities?: string[];
  maxOccupants?: { adults?: number; kids?: number; infants?: number } | null;
  shortletInfo?: { pricePerNight?: number } | null;
  rentalInfo?: { pricing?: Record<string, number> } | null;
}

/** Maps a rental pricing key to a display label */
export const PRICING_LABELS: Record<string, string> = {
  daily: "/ day",
  weekly: "/ week",
  monthly: "/ month",
  quarterly: "/ quarter",
  biannual: "/ 6 months",
  yearly: "/ year",
  biennial: "/ 2 years",
};

/** PropertyCard-compatible shape */
export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  priceLabel?: string;
  rating: number;
  reviews: number;
  image: string;
  type: "shortlet" | "rental";
  amenities: string[];
  maxGuests: number;
}

/** Map an API listing to the shape PropertyCard expects */
export function toPropertyCardData(listing: ListingCardSource): PropertyCardData {
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
    slug: listing.slug,
    title: listing.title,
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
