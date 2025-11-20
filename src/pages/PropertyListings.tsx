import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, MapPin, X } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties, cities, propertyTypes, amenitiesList } from "@/data/mockData";

const PropertyListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties based on current filters
  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || 
                       property.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesType = selectedType === "all" || property.type === selectedType;
    const matchesAmenities = selectedAmenities.length === 0 ||
                            selectedAmenities.every(amenity => 
                              property.amenities.includes(amenity)
                            );
    
    let matchesPrice = true;
    if (priceRange.min) {
      matchesPrice = matchesPrice && property.price >= parseInt(priceRange.min);
    }
    if (priceRange.max) {
      matchesPrice = matchesPrice && property.price <= parseInt(priceRange.max);
    }

    return matchesSearch && matchesCity && matchesType && matchesAmenities && matchesPrice;
  });

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    }
  };

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showFilters && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex-shrink-0 h-9 px-3"
              size="sm"
            >
              <Filter className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:block text-sm">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Backdrop */}
      {showFilters && (
        <div 
          className="fixed top-[65px] left-0 right-0 bottom-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Mobile Overlay */}
          <div className={`
            ${showFilters ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            fixed md:static
            top-[65px] md:top-0 left-0
            h-[calc(100vh-65px)] md:h-auto
            w-[85%] sm:w-96 md:w-80
            bg-white md:bg-transparent
            z-40 md:z-auto
            transition-transform duration-300 ease-in-out
            shadow-xl md:shadow-none
            flex flex-col md:block
          `}>
            <Card className="flex-1 md:flex-none h-full md:h-auto rounded-none md:rounded-lg flex flex-col md:block overflow-hidden">
              {/* Header - Fixed at top on mobile */}
              {/* <div className="flex-shrink-0 p-6 pb-4 border-b md:border-b-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="md:hidden -mr-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div> */}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto md:overflow-visible p-6 pt-4 md:pt-0 pb-24 md:pb-0">
                {/* Location */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Location</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
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

                {/* Property Type */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Property Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Price Range (₦)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Amenities</label>
                  <div className="space-y-2 overflow-y-auto">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => 
                            handleAmenityChange(amenity, checked as boolean)
                          }
                        />
                        <label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Apply Button - Fixed at bottom */}
              <div className="md:hidden flex-shrink-0 absolute bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                <Button 
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-neutral-600">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  No properties found
                </h3>
                <p className="text-neutral-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;