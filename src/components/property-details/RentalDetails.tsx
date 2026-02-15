import { format } from "date-fns";
import { CalendarDays, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ListingDetail } from "@/services/listings";

interface RentalDetailsProps {
  rentalInfo: NonNullable<ListingDetail["rentalInfo"]>;
}

function FeeItem({
  label,
  amount,
  refundable,
}: {
  label: string;
  amount: number;
  refundable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border text-sm">
      <div>
        <span>{label}</span>
        {refundable && (
          <span className="ml-1.5 text-xs text-green-600">(Refundable)</span>
        )}
      </div>
      <span className="font-medium">₦{amount.toLocaleString()}</span>
    </div>
  );
}

export function RentalDetails({ rentalInfo }: RentalDetailsProps) {
  const pricing = rentalInfo.pricing;
  const hasPricing = pricing && Object.keys(pricing).length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rental details</h2>

      {/* Pricing table */}
      {hasPricing && (
        <div className="space-y-2">
          <h3 className="text-base font-medium">Pricing options</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(pricing)
              .sort(([, a], [, b]) => Number(a) - Number(b))
              .map(([term, amount]) => (
                <div key={term} className="p-3 rounded-lg bg-neutral-50 border text-center">
                  <p className="text-xs text-muted-foreground capitalize">{term}</p>
                  <p className="text-sm font-semibold mt-0.5">
                    ₦{Number(amount).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Fees */}
      {(rentalInfo.serviceCharge ||
        rentalInfo.cautionFee ||
        rentalInfo.securityDeposit ||
        rentalInfo.inspectionFee) && (
        <div className="space-y-2">
          <h3 className="text-base font-medium">Fees</h3>
          <div className="grid grid-cols-2 gap-3">
            {rentalInfo.inspectionFee != null && rentalInfo.inspectionFee > 0 && (
              <FeeItem label="Inspection fee" amount={rentalInfo.inspectionFee} />
            )}
            {rentalInfo.serviceCharge != null && rentalInfo.serviceCharge > 0 && (
              <FeeItem label="Service charge" amount={rentalInfo.serviceCharge} />
            )}
            {rentalInfo.cautionFee != null && rentalInfo.cautionFee > 0 && (
              <FeeItem label="Caution fee" amount={rentalInfo.cautionFee} />
            )}
            {rentalInfo.securityDeposit != null && rentalInfo.securityDeposit > 0 && (
              <FeeItem
                label="Security deposit"
                amount={rentalInfo.securityDeposit}
                refundable
              />
            )}
          </div>
        </div>
      )}

      {/* Contract terms */}
      {rentalInfo.contractTerms && rentalInfo.contractTerms.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-medium">Contract terms</h3>
          <div className="flex flex-wrap gap-2">
            {rentalInfo.contractTerms.map((term, i) => (
              <Badge key={i} variant="outline" className="capitalize">
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Payment frequency */}
      {rentalInfo.paymentFrequency && (
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Payment frequency:</span>
          <span className="font-medium capitalize">{rentalInfo.paymentFrequency}</span>
        </div>
      )}

      {/* Available from date */}
      {rentalInfo.availableFromDate && (
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Available from:</span>
          <span className="font-medium">
            {format(new Date(rentalInfo.availableFromDate), "MMM d, yyyy")}
          </span>
        </div>
      )}

      {/* Required documents */}
      {rentalInfo.requiredDocuments && rentalInfo.requiredDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-medium flex items-center gap-2">
            Required documents
          </h3>
          <ul className="space-y-1.5">
            {rentalInfo.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
