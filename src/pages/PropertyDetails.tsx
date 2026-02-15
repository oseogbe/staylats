import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Heart,
  Share,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShortletBookingCard } from "@/components/booking/ShortletBookingCard";
import { RentalBookingCard } from "@/components/booking/RentalBookingCard";
import {
  ImageGallery,
  ImageLightbox,
  LocationMap,
  PropertyDetailsSkeleton,
  ShortletDetails,
  RentalDetails,
  getAmenityIcon,
} from "@/components/property-details";
import { useListingBySlug } from "@/hooks/use-listings";
import { PRICING_LABELS } from "@/lib/listingHelpers";
import type { ListingDetail } from "@/services/listings";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getRentalDisplayPrice(listing: ListingDetail) {
  const pricing = listing.rentalInfo?.pricing;
  if (!pricing || Object.keys(pricing).length === 0) return { price: 0, label: "/ month" };
  const [lowestKey, lowestValue] = Object.entries(pricing).reduce((best, cur) =>
    Number(cur[1]) < Number(best[1]) ? cur : best
  );
  return {
    price: Number(lowestValue),
    label: PRICING_LABELS[lowestKey.toLowerCase()] ?? `/ ${lowestKey}`,
  };
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
const PropertyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: listing, isLoading, isError } = useListingBySlug(slug);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  // Derived values
  const maxGuests = useMemo(() => {
    if (!listing) return 0;
    return (
      (listing.maxOccupants?.adults ?? 0) +
      (listing.maxOccupants?.kids ?? 0) +
      (listing.maxOccupants?.infants ?? 0)
    );
  }, [listing]);

  const rentalPrice = useMemo(() => {
    if (!listing || listing.type !== "rental") return null;
    return getRentalDisplayPrice(listing);
  }, [listing]);

  const hostName = useMemo(() => {
    if (!listing?.user) return "Host";
    const parts = [listing.user.firstName, listing.user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Host";
  }, [listing]);

  const hostSince = useMemo(() => {
    if (!listing?.user?.createdAt) return "";
    return format(new Date(listing.user.createdAt), "MMMM yyyy");
  }, [listing]);

  // ----- Loading -----
  if (isLoading) return <PropertyDetailsSkeleton />;

  // ----- Error / not found -----
  if (isError || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
            <Home className="h-8 w-8 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold">Property not found</h1>
          <p className="text-muted-foreground max-w-sm">
            The property you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate("/properties")}>Browse Properties</Button>
        </div>
      </div>
    );
  }

  const location = `${listing.city}, ${listing.state}`;
  const displayPrice =
    listing.type === "shortlet"
      ? listing.shortletInfo?.pricePerNight ?? 0
      : rentalPrice?.price ?? 0;
  const displayPriceLabel =
    listing.type === "shortlet" ? "/ night" : rentalPrice?.label ?? "/ month";

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------------------------------------------------------- */}
      {/* Sticky header                                                     */}
      {/* ---------------------------------------------------------------- */}
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
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
        {/* -------------------------------------------------------------- */}
        {/* Image gallery (full width)                                      */}
        {/* -------------------------------------------------------------- */}
        <div className="mb-8">
          <ImageGallery
            images={listing.images}
            title={listing.title}
            onImageClick={openLightbox}
            onShowAll={() => openLightbox(0)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* -------------------------------------------------------------- */}
          {/* Main content                                                    */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property info header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {listing.type === "shortlet" ? "Shortlet" : "Rental"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {listing.propertyType}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-primary" />
                      <span>0.0</span>
                      <span>(0 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="flex items-center max-sm:justify-between gap-6 py-4 border-y">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Up to {maxGuests} guest{maxGuests !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Mobile price summary */}
              <div className="lg:hidden flex items-baseline gap-1.5 py-2">
                <span className="text-xl font-bold">₦{displayPrice.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">{displayPriceLabel}</span>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">About this place</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description || "No description provided."}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What this place offers</h2>
                {listing.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                          <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No amenities listed.</p>
                )}
              </div>

              <Separator />

              {/* Type-specific details */}
              {listing.type === "shortlet" && listing.shortletInfo && (
                <>
                  <ShortletDetails shortletInfo={listing.shortletInfo} />
                  <Separator />
                </>
              )}

              {listing.type === "rental" && listing.rentalInfo && (
                <>
                  <RentalDetails rentalInfo={listing.rentalInfo} />
                  <Separator />
                </>
              )}

              {/* Host info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Hosted by {hostName}</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                    {listing.user.image ? (
                      <img
                        src={listing.user.image}
                        alt={hostName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-neutral-500">
                        {(listing.user.firstName?.[0] ?? "H").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{hostName}</p>
                    {hostSince && (
                      <p className="text-sm text-muted-foreground">
                        Member since {hostSince}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location map */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Location</h2>
                <LocationMap
                  latitude={listing.location?.lat ?? 0}
                  longitude={listing.location?.lng ?? 0}
                  locationLabel={location}
                />
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Booking card (sidebar)                                          */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:col-span-1">
            {listing.type === "shortlet" ? (
              <ShortletBookingCard
                price={listing.shortletInfo?.pricePerNight ?? 0}
                cleaningFee={listing.shortletInfo?.cleaningFee ?? undefined}
                securityDeposit={listing.shortletInfo?.securityDeposit ?? undefined}
                rating={0}
                reviews={0}
                maxGuests={maxGuests}
              />
            ) : (
              <RentalBookingCard
                pricing={listing.rentalInfo?.pricing ?? {}}
                serviceCharge={listing.rentalInfo?.serviceCharge ?? undefined}
                cautionFee={listing.rentalInfo?.cautionFee ?? undefined}
                securityDeposit={listing.rentalInfo?.securityDeposit ?? undefined}
                inspectionFee={listing.rentalInfo?.inspectionFee ?? undefined}
                rating={0}
                reviews={0}
              />
            )}
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      <ImageLightbox
        images={listing.images}
        open={lightboxOpen}
        initialIndex={lightboxIndex}
        onOpenChange={setLightboxOpen}
        title={listing.title}
      />
    </div>
  );
};

export default PropertyDetails;
