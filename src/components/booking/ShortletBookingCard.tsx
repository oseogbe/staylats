import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GuestPicker, GuestCounts } from "@/components/GuestPicker";

interface ShortletBookingCardProps {
  price: number;
  cleaningFee?: number;
  securityDeposit?: number;
  rating: number;
  reviews: number;
  maxGuests: number;
}

export const ShortletBookingCard = ({
  price,
  cleaningFee,
  securityDeposit,
  rating,
  reviews,
  maxGuests,
}: ShortletBookingCardProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const totalGuests = guests.adults + guests.children;
  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const subtotal = nights * price;
  const serviceFee = Math.round(subtotal * 0.1);
  const cleaningTotal = cleaningFee ?? 0;
  const depositTotal = securityDeposit ?? 0;
  const totalWithFees = subtotal + serviceFee + cleaningTotal + depositTotal;

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
            <label className="text-xs font-medium text-muted-foreground uppercase">
              CHECK-IN
            </label>
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
            <label className="text-xs font-medium text-muted-foreground uppercase">
              CHECKOUT
            </label>
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
          <label className="text-xs font-medium text-muted-foreground uppercase">
            GUESTS
          </label>
          <GuestPicker
            guests={guests}
            onGuestsChange={setGuests}
            maxGuests={maxGuests}
            buttonClassName="w-full"
          />
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            disabled={!checkIn || !checkOut || totalGuests === 0}
          >
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
                <span>
                  ₦{price.toLocaleString()} x {nights} night{nights !== 1 ? "s" : ""}
                </span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              {cleaningTotal > 0 && (
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>₦{cleaningTotal.toLocaleString()}</span>
                </div>
              )}
              {depositTotal > 0 && (
                <div className="flex justify-between">
                  <span>Security deposit (refundable)</span>
                  <span>₦{depositTotal.toLocaleString()}</span>
                </div>
              )}
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
