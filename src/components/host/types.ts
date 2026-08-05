export interface PropertyListing {
  id: string;
  title: string;
  type: "rental" | "shortlet";
  status: "draft" | "pending" | "active" | "declined";
  description?: string;
  address?: string;
  propertyType?: string;
  images?: string[];
  amenities?: string[];
  stepsRemaining?: number;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  // Card summary, derived via toPropertyCardData. Absent on drafts, which have
  // no location or pricing yet.
  slug?: string;
  location?: string;
  price?: number;
  priceLabel?: string;
  rating?: number;
  reviews?: number;
  maxGuests?: number;
}