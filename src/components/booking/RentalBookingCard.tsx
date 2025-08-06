import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Star, Info, User, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RentalBookingCardProps {
  price: number;
  rating: number;
  reviews: number;
}

const durationOptions = [
  { value: "1", label: "1 month", discount: 0 },
  { value: "3", label: "3 months", discount: 0.074 },
  { value: "6", label: "6 months", discount: 0.12 },
  { value: "12", label: "1 year", discount: 0.15 },
  { value: "24", label: "2 years", discount: 0.20 },
];

export const RentalBookingCard = ({ price, rating, reviews }: RentalBookingCardProps) => {
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [duration, setDuration] = useState<string>();
  const [isVerified, setIsVerified] = useState(false); // Mock verification state

  const selectedDuration = durationOptions.find(d => d.value === duration);
  const months = selectedDuration ? parseInt(selectedDuration.value) : 0;
  const discount = selectedDuration?.discount || 0;
  const monthlyRate = price;
  const totalMonthlyPayment = monthlyRate * months;
  const discountAmount = totalMonthlyPayment * discount;
  const discountedTotal = totalMonthlyPayment - discountAmount;
  const serviceFee = 20000; // Fixed service fee for rental
  const securityDeposit = 100000; // Fixed security deposit
  const legalFees = 0; // No legal fees in this example
  const totalAmount = discountedTotal + serviceFee + securityDeposit + legalFees;

  const handleCompleteProfile = () => {
    // Mock completing profile
    console.log("Complete profile clicked");
  };

  const handleVerifyIdentity = () => {
    // Mock verifying identity
    console.log("Verify identity clicked");
    setIsVerified(true);
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold">₦{price.toLocaleString()}</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-current text-primary" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
          </div>
        </div>

        <Separator />

        {/* Move-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">What's your move-in date?</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !moveInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {moveInDate ? format(moveInDate, "MMM dd, yyyy") : "Select move-in date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={moveInDate}
                onSelect={setMoveInDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">How long do you need the place for?</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.discount > 0 && (
                      <span className="text-green-600 text-xs ml-2">
                        {(option.discount * 100).toFixed(1)}% off
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cost Breakdown */}
        {duration && (
          <div className="space-y-3">
            <h3 className="font-medium">Cost Breakdown</h3>
            
            {discount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {(discount * 100).toFixed(1)}% Discount Applied
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  You save ₦{discountAmount.toLocaleString()} compared to monthly rates
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{months} months Rent</span>
                <div className="text-right">
                  {discount > 0 && (
                    <div className="text-xs text-muted-foreground line-through">
                      ₦{totalMonthlyPayment.toLocaleString()}
                    </div>
                  )}
                  <div>₦{discountedTotal.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>One-time Service charge</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Legal and Agencies Fees</span>
                <span>₦{legalFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Refundable Security Deposit</span>
                <span>₦{securityDeposit.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Notice or Apply Button */}
        {!isVerified ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-primary">Verification Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your profile and verify your identity to proceed with the rental application.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={handleCompleteProfile}
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleVerifyIdentity}
                size="sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify Identity
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg" 
              disabled={!moveInDate || !duration}
            >
              Apply for Rent
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Send Inquiry
            </Button>
          </div>
        )}

        {!isVerified && (
          <div className="text-center text-sm text-muted-foreground">
            Complete verification to apply for this rental
          </div>
        )}
      </div>
    </Card>
  );
};