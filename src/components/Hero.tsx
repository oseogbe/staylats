import React from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Search, MapPin, Users, CalendarIcon } from "lucide-react";

import heroImage from "@/assets/serviced-apartment.png";

const Hero = () => {
  const [propertyType, setPropertyType] = React.useState<"shortlets" | "rentals">("shortlets");
  const [checkInDate, setCheckInDate] = React.useState<Date>();
  const [checkOutDate, setCheckOutDate] = React.useState<Date>();
  const [moveInDate, setMoveInDate] = React.useState<Date>();

  return (
    <section className="relative h-screen md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Lagos skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Find Your Perfect Stay in{" "}
          <span className="text-primary">Nigeria</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-neutral-200">
          Discover amazing shortlets and rentals in Abuja and Lagos
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 shadow-large max-w-4xl mx-auto">
          {/* Property Type Selector */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="bg-neutral-100 p-1 rounded-lg">
                <Button
                  variant={propertyType === "shortlets" ? "default" : "ghost"}
                  onClick={() => setPropertyType("shortlets")}
                  className="px-6 py-2 rounded-md"
                >
                  Shortlets
                </Button>
                <Button
                  variant={propertyType === "rentals" ? "default" : "ghost"}
                  onClick={() => setPropertyType("rentals")}
                  className="px-6 py-2 rounded-md"
                >
                  Rentals
                </Button>
              </div>
            </div>
          </div>

          {/* Search Fields */}
          <div className={`grid grid-cols-1 gap-4 ${propertyType === "shortlets" ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {/* Location - Always visible */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  placeholder="Abuja, Lagos"
                  className="pl-10 h-12 border-neutral-300 focus:border-primary"
                />
              </div>
            </div>

            {propertyType === "shortlets" ? (
              <>
                {/* Check-in */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Check in
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
                      >
                        <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                        {checkInDate ? format(checkInDate, "PPP") : <span className="absolute left-16 text-slate-400 !font-normal">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Check out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
                      >
                        <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                        {checkOutDate ? format(checkOutDate, "PPP") : <span className="absolute left-16 text-slate-400 !font-normal">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      placeholder="Add guests"
                      className="pl-10 h-12 border-neutral-300 focus:border-primary"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Move-in Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Move-in date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
                      >
                        <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                        {moveInDate ? format(moveInDate, "PPP") : <span className="absolute left-16 text-slate-400 !font-normal">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={moveInDate}
                        onSelect={setMoveInDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Contract Term */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Contract term
                  </label>
                  <Select>
                    <SelectTrigger className="h-12 border-neutral-300 focus:border-primary">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                      <SelectItem value="2years">2 years</SelectItem>
                      <SelectItem value="3years">3 years</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <Button className="w-full md:w-auto mt-6 h-12 px-8 bg-primary hover:bg-primary-hover">
            <Search className="h-5 w-5 mr-2" />
            Search {propertyType === "shortlets" ? "Shortlets" : "Rentals"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;