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
}