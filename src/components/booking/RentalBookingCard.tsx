import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Star, Info, User, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RentalBookingCardProps {
  /** Object mapping pricing term keys to amounts, e.g. { monthly: 150000, yearly: 1500000 } */
  pricing: Record<string, number>;
  serviceCharge?: number;
  cautionFee?: number;
  securityDeposit?: number;
  inspectionFee?: number;
  rating: number;
  reviews: number;
}

/** Human-readable labels for pricing term keys */
const TERM_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  biannual: "6 Months",
  yearly: "Yearly",
  biennial: "2 Years",
};

export const RentalBookingCard = ({
  pricing,
  serviceCharge,
  cautionFee,
  securityDeposit,
  inspectionFee,
  rating,
  reviews,
}: RentalBookingCardProps) => {
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [selectedTerm, setSelectedTerm] = useState<string>();
  const [isVerified, setIsVerified] = useState(false);

  // Build pricing options sorted by amount ascending
  const pricingOptions = useMemo(() => {
    return Object.entries(pricing)
      .map(([term, amount]) => ({
        term,
        label: TERM_LABELS[term.toLowerCase()] ?? term,
        amount: Number(amount),
      }))
      .sort((a, b) => a.amount - b.amount);
  }, [pricing]);

  // Lowest pricing for display at top
  const lowestOption = pricingOptions[0];

  const selected = pricingOptions.find((o) => o.term === selectedTerm);
  const rent = selected?.amount ?? 0;
  const serviceChargeAmount = serviceCharge ?? 0;
  const cautionFeeAmount = cautionFee ?? 0;
  const depositAmount = securityDeposit ?? 0;
  const inspectionAmount = inspectionFee ?? 0;
  const totalAmount = rent + serviceChargeAmount + cautionFeeAmount + depositAmount + inspectionAmount;

  const handleCompleteProfile = () => {
    console.log("Complete profile clicked");
  };

  const handleVerifyIdentity = () => {
    console.log("Verify identity clicked");
    setIsVerified(true);
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold">
              ₦{(lowestOption?.amount ?? 0).toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              / {lowestOption?.label?.toLowerCase() ?? "month"}
            </span>
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

        {/* Contract term selection */}
        {pricingOptions.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select rental period</label>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {pricingOptions.map((option) => (
                  <SelectItem key={option.term} value={option.term}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{option.label}</span>
                      <span className="text-muted-foreground text-xs">
                        ₦{option.amount.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cost Breakdown */}
        {selectedTerm && selected && (
          <div className="space-y-3">
            <h3 className="font-medium">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rent ({selected.label})</span>
                <span>₦{rent.toLocaleString()}</span>
              </div>
              {inspectionAmount > 0 && (
                <div className="flex justify-between">
                  <span>Inspection fee</span>
                  <span>₦{inspectionAmount.toLocaleString()}</span>
                </div>
              )}
              {serviceChargeAmount > 0 && (
                <div className="flex justify-between">
                  <span>Service charge</span>
                  <span>₦{serviceChargeAmount.toLocaleString()}</span>
                </div>
              )}
              {cautionFeeAmount > 0 && (
                <div className="flex justify-between">
                  <span>Caution fee</span>
                  <span>₦{cautionFeeAmount.toLocaleString()}</span>
                </div>
              )}
              {depositAmount > 0 && (
                <div className="flex justify-between">
                  <span>Security deposit (refundable)</span>
                  <span>₦{depositAmount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
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
                  Complete your profile and verify your identity to proceed with the rental
                  application.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={handleCompleteProfile} size="sm">
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
              disabled={!moveInDate || !selectedTerm}
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
