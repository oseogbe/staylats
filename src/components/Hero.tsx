import React from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Search, MapPin, CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import heroImage from "@/assets/serviced-apartment.png";
import { GuestPicker, GuestCounts } from "@/components/GuestPicker";

const cities = [
  { value: 'abuja', label: 'Abuja' },
  { value: 'lagos', label: 'Lagos' }
];

const contractTerms = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (3 months)' },
  { value: 'bi-annual', label: 'Bi-annual (6 months)' },
  { value: 'yearly', label: 'Yearly (12 months)' },
  { value: 'biennial', label: 'Biennial (24 months)' }
];

const Hero = () => {
  const [propertyType, setPropertyType] = React.useState<"shortlets" | "rentals">("shortlets");
  const [checkInDate, setCheckInDate] = React.useState<Date>();
  const [checkOutDate, setCheckOutDate] = React.useState<Date>();
  const [moveInDate, setMoveInDate] = React.useState<Date>();

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stepper logic
  const [step, setStep] = React.useState(0);
  const [where, setWhere] = React.useState("");
  const [guests, setGuests] = React.useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [contractTerm, setContractTerm] = React.useState("");

  const totalGuests = guests.adults + guests.children;

  const isMobileView = windowWidth < 768;
  const shortletSteps = [
    {
      label: "Where",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Where</label>
          <Select value={where} onValueChange={setWhere}>
            <SelectTrigger className="h-12 border-neutral-300 focus:border-primary">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      validate: () => where !== ""
    },
    {
      label: "Check in",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Check in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
              >
                <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                {checkInDate ? format(checkInDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
      ),
      validate: () => !!checkInDate
    },
    {
      label: "Check out",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Check out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
              >
                <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                {checkOutDate ? format(checkOutDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
      ),
      validate: () => !!checkOutDate
    },
    {
      label: "Guests",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Guests</label>
          <GuestPicker
            guests={guests}
            onGuestsChange={setGuests}
            buttonClassName="w-full h-12 border-neutral-300"
          />
        </div>
      ),
      validate: () => totalGuests > 0
    }
  ];
  const rentalSteps = [
    {
      label: "Where",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Where</label>
          <Select value={where} onValueChange={setWhere}>
            <SelectTrigger className="h-12 border-neutral-300 focus:border-primary">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      validate: () => where !== ""
    },
    {
      label: "Move-in date",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Move-in date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="pl-10 h-12 w-full border-neutral-300 focus:border-primary justify-start"
              >
                <CalendarIcon className="absolute left-3 h-5 w-5 text-neutral-400" />
                {moveInDate ? format(moveInDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
      ),
      validate: () => !!moveInDate
    },
    {
      label: "Contract term",
      content: (
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">Contract term</label>
          <Select value={contractTerm} onValueChange={setContractTerm}>
            <SelectTrigger className="h-12 border-neutral-300 focus:border-primary">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {contractTerms.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      validate: () => contractTerm !== ""
    }
  ];
  const steps = propertyType === "shortlets" ? shortletSteps : rentalSteps;

  return (
    <section className="relative h-screen md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="a modern serviced apartment in Nigeria"
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
          {/* Property Type Selector - Always at top */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="bg-neutral-100 p-1 rounded-lg">
                <Button
                  variant={propertyType === "shortlets" ? "default" : "ghost"}
                  onClick={() => {setPropertyType("shortlets"); setStep(0);}}
                  className="px-6 py-2 rounded-md"
                >
                  Shortlets
                </Button>
                <Button
                  variant={propertyType === "rentals" ? "default" : "ghost"}
                  onClick={() => {setPropertyType("rentals"); setStep(0);}}
                  className="px-6 py-2 rounded-md"
                >
                  Rentals
                </Button>
              </div>
            </div>
          </div>
          {/* Stepper for mobile view */}
          {isMobileView ? (
            <div>
              {/* Progress indicator */}
              <div className="flex items-center justify-center mb-4 gap-2">
                {[...Array(steps.length)].map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full ${step === i ? 'bg-primary' : 'bg-neutral-300'}`}></span>
                ))}
              </div>
              <div className="relative min-h-[100px] flex items-center">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={step}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ duration: 0.35, type: 'spring' }}
                    className="w-full"
                  >
                    {steps[step].content}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={step === 0}
                  onClick={() => step > 0 && setStep(step-1)}
                  aria-label="Back"
                  className="mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                {step < steps.length - 1 ? (
                  <Button
                    onClick={() => steps[step].validate() && setStep(step+1)}
                    disabled={!steps[step].validate()}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="w-full ml-auto bg-primary hover:bg-primary-hover"
                    disabled={!steps[step].validate()}
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search {propertyType === 'shortlets' ? 'Shortlets' : 'Rentals'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 gap-4 ${propertyType === "shortlets" ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {/* Location - Always visible */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Where
                  </label>
                  <Select value={where} onValueChange={setWhere}>
                    <SelectTrigger className="h-12 border-neutral-300 focus:border-primary">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                            {checkInDate ? format(checkInDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
                            {checkOutDate ? format(checkOutDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
                      <GuestPicker
                        guests={guests}
                        onGuestsChange={setGuests}
                        buttonClassName="w-full h-12 border-neutral-300"
                      />
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
                            {moveInDate ? format(moveInDate, "PPP") : <span className="text-slate-400 !font-normal">Pick a date</span>}
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
                          {contractTerms.map((term) => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;