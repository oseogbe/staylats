import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Star, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ShortletBookingCardProps {
  price: number;
  rating: number;
  reviews: number;
  maxGuests: number;
}

export const ShortletBookingCard = ({ price, rating, reviews, maxGuests }: ShortletBookingCardProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });

  const totalGuests = guests.adults + guests.children;
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * price;
  const serviceFee = Math.round(totalPrice * 0.1);
  const totalWithFees = totalPrice + serviceFee;

  const updateGuests = (type: keyof typeof guests, increment: boolean) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold">₦{price.toLocaleString()}</span>
            <span className="text-muted-foreground">/ night</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-current text-primary" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
          </div>
        </div>

        <Separator />

        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">CHECK-IN</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MM/dd/yyyy") : "Add date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">CHECKOUT</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MM/dd/yyyy") : "Add date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date <= (checkIn || new Date())}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase">GUESTS</label>
          <Popover open={showGuestPicker} onOpenChange={setShowGuestPicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('adults', false)}
                      disabled={guests.adults <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center">{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('adults', true)}
                      disabled={totalGuests >= maxGuests}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-muted-foreground">Ages 2-12</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('children', false)}
                      disabled={guests.children <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center">{guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('children', true)}
                      disabled={totalGuests >= maxGuests}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-muted-foreground">Under 2</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('infants', false)}
                      disabled={guests.infants <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center">{guests.infants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('infants', true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Pets</div>
                    <div className="text-sm text-muted-foreground underline cursor-pointer">
                      Bringing a service animal?
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('pets', false)}
                      disabled={guests.pets <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center">{guests.pets}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests('pets', true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                  This place has a maximum of {maxGuests} guests, not including infants. Pets aren't allowed.
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" onClick={() => setShowGuestPicker(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" disabled={!checkIn || !checkOut || totalGuests === 0}>
            Book Now
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Send Inquiry
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          You won't be charged yet
        </div>

        {nights > 0 && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>₦{price.toLocaleString()} x {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₦{totalWithFees.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};