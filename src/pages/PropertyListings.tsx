import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Home,
  BedDouble,
  House,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PropertyCard from "@/components/PropertyCard";

import { useActiveListings } from "@/hooks/use-listings";
import { toPropertyCardData } from "@/lib/listingHelpers";
import { amenitiesList as rentalAmenities } from "@/components/rental-listing/types";
import { amenitiesList as shortletAmenities } from "@/components/shortlet-listing/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const allAmenities = Array.from(
  new Set([...rentalAmenities, ...shortletAmenities])
).sort();

const cities = ["Abuja", "Lagos"];

const typeFilters = [
  { value: "all", label: "All", icon: Home },
  { value: "shortlet", label: "Shortlets", icon: BedDouble },
  { value: "rental", label: "Rentals", icon: House },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PropertyListings = () => {
  const [searchParams] = useSearchParams();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Data
  const { data: activeListings = [], isLoading } = useActiveListings(50);

  const allProperties = useMemo(
    () => activeListings.map(toPropertyCardData),
    [activeListings]
  );

  const filteredProperties = useMemo(() => {
    return allProperties.filter((p) => {
      if (
        searchTerm &&
        !p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !p.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      if (
        selectedCity !== "all" &&
        !p.location.toLowerCase().includes(selectedCity.toLowerCase())
      )
        return false;
      if (selectedType !== "all" && p.type !== selectedType) return false;
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((a) => p.amenities.includes(a))
      )
        return false;
      if (priceRange.min && p.price < parseInt(priceRange.min)) return false;
      if (priceRange.max && p.price > parseInt(priceRange.max)) return false;
      return true;
    });
  }, [
    allProperties,
    searchTerm,
    selectedCity,
    selectedType,
    selectedAmenities,
    priceRange,
  ]);

  // Helpers
  const handleAmenityToggle = useCallback(
    (amenity: string, checked: boolean) => {
      setSelectedAmenities((prev) =>
        checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)
      );
    },
    []
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCity !== "all") count++;
    if (selectedType !== "all") count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (priceRange.min || priceRange.max) count++;
    return count;
  }, [selectedCity, selectedType, selectedAmenities, priceRange]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
    setSelectedType("all");
    setSelectedAmenities([]);
    setPriceRange({ min: "", max: "" });
  };

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "city":
        setSelectedCity("all");
        break;
      case "type":
        setSelectedType("all");
        break;
      case "amenity":
        if (value) setSelectedAmenities((prev) => prev.filter((a) => a !== value));
        break;
      case "price":
        setPriceRange({ min: "", max: "" });
        break;
    }
  };

  // Lock body scroll on mobile sheet
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileFiltersOpen]);

  // ------------------------------------------------------------------
  // Shared filter controls (used in both desktop bar and mobile sheet)
  // ------------------------------------------------------------------
  const FilterControls = ({
    className = "",
    expandAmenities = false,
  }: {
    className?: string;
    /** When true, amenities list grows to fill available space (for mobile sheet) */
    expandAmenities?: boolean;
  }) => (
    <div className={className}>
      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">Location</label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city.toLowerCase()}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Price Range (₦)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="h-10"
          />
          <span className="self-center text-neutral-400">–</span>
          <Input
            placeholder="Max"
            type="number"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="h-10"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className={`space-y-2 ${expandAmenities ? "flex-1 flex flex-col min-h-0" : ""}`}>
        <label className="text-sm font-medium text-neutral-700">Amenities</label>
        <div className={expandAmenities ? "flex-1 min-h-0 overflow-y-auto" : ""}>
          <ScrollArea className={expandAmenities ? "h-full" : "h-56"}>
            <div className="space-y-2.5 pr-3">
              {allAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <Checkbox
                    id={`filter-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) =>
                      handleAmenityToggle(amenity, checked as boolean)
                    }
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50/80">
      {/* ---------------------------------------------------------------- */}
      {/* Sticky top bar                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row 1: Search + filter button */}
          <div className="flex items-center gap-3 py-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                placeholder="Search by name or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-full border-neutral-200 bg-neutral-50 focus:bg-white transition-colors text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Desktop: amenities popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 h-11 rounded-full border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] bg-primary text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 p-5"
                sideOffset={8}
              >
                <FilterControls className="space-y-5" />
              </PopoverContent>
            </Popover>

            {/* Mobile: filter trigger */}
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden h-11 w-11 rounded-full border-neutral-200 p-0 relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Row 2: Type pills + city select (desktop) */}
          <div className="flex items-center gap-3 pt-1 pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {typeFilters.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200 border
                  ${
                    selectedType === t.value
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
                  }
                `}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}

            <span className="hidden sm:block w-px h-6 bg-neutral-200 flex-shrink-0" />

            {/* Inline city select on desktop */}
            <div className="hidden sm:block">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-9 rounded-full border-neutral-200 bg-white text-sm min-w-[130px]">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile filters sheet                                              */}
      {/* ---------------------------------------------------------------- */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col">
          <SheetHeader className="text-left pb-2 flex-shrink-0">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto py-2 -mx-1 px-1">
            <FilterControls className="space-y-6 flex flex-col h-full" expandAmenities />
          </div>
          <SheetFooter className="flex-row gap-3 pt-3 border-t flex-shrink-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
            <SheetClose asChild>
              <Button className="flex-1">
                Show {filteredProperties.length} results
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ---------------------------------------------------------------- */}
      {/* Active filter pills                                               */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-b border-neutral-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex-shrink-0">
                Active:
              </span>

              {selectedCity !== "all" && (
                <FilterPill
                  label={cities.find((c) => c.toLowerCase() === selectedCity) || selectedCity}
                  onRemove={() => removeFilter("city")}
                />
              )}
              {selectedType !== "all" && (
                <FilterPill
                  label={typeFilters.find((t) => t.value === selectedType)?.label || selectedType}
                  onRemove={() => removeFilter("type")}
                />
              )}
              {(priceRange.min || priceRange.max) && (
                <FilterPill
                  label={`₦${priceRange.min || "0"} – ₦${priceRange.max || "∞"}`}
                  onRemove={() => removeFilter("price")}
                />
              )}
              {selectedAmenities.map((a) => (
                <FilterPill
                  key={a}
                  label={a}
                  onRemove={() => removeFilter("amenity", a)}
                />
              ))}

              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap ml-1 transition-colors"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------- */}
      {/* Results                                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-neutral-500">
            {isLoading ? (
              <Skeleton className="h-4 w-40 inline-block" />
            ) : (
              <>
                <span className="font-semibold text-neutral-900">
                  {filteredProperties.length}
                </span>{" "}
                {filteredProperties.length === 1 ? "property" : "properties"}{" "}
                found
              </>
            )}
          </p>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm">
                <Skeleton className="w-full aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-32 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loaded state */}
        {!isLoading && filteredProperties.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${selectedCity}-${selectedType}-${selectedAmenities.join()}-${priceRange.min}-${priceRange.max}-${searchTerm}`}
          >
            {filteredProperties.map((property) => (
              <motion.div key={property.id} variants={cardVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
              <MapPin className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No properties found
            </h3>
            <p className="text-neutral-500 max-w-sm mb-6">
              We couldn't find any properties matching your filters. Try
              adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="rounded-full"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Filter pill sub-component
// ---------------------------------------------------------------------------
function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700 whitespace-nowrap"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-neutral-200 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.span>
  );
}

export default PropertyListings;
