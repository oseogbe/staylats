import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestPickerProps {
  guests: GuestCounts;
  onGuestsChange: (guests: GuestCounts) => void;
  maxGuests?: number;
  buttonClassName?: string;
  contentAlign?: "start" | "center" | "end";
}

export const GuestPicker = ({ 
  guests, 
  onGuestsChange, 
  maxGuests,
  buttonClassName = "",
  contentAlign = "start"
}: GuestPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const totalGuests = guests.adults + guests.children;

  const updateGuests = (type: keyof GuestCounts, increment: boolean) => {
    const newGuests = {
      ...guests,
      [type]: Math.max(type === 'adults' ? 1 : 0, guests[type] + (increment ? 1 : -1))
    };
    onGuestsChange(newGuests);
  };

  const isMaxReached = maxGuests ? totalGuests >= maxGuests : false;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-start text-left font-normal ${buttonClassName}`}
        >
          {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align={contentAlign}>
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
                disabled={isMaxReached}
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
                disabled={isMaxReached}
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

          {maxGuests && (
            <div className="text-xs text-muted-foreground pt-2">
              This place has a maximum of {maxGuests} guests, not including infants. Pets aren't allowed.
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

