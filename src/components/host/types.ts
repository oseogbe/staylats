export interface PropertyListing {
  id: string;
  title: string;
  type: "rental" | "shortlet";
  status: "published" | "draft";
  stepsRemaining?: number;
  lastUpdated: string;
  image?: string;
}