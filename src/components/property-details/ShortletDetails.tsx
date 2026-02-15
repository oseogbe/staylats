import { format } from "date-fns";
import { Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import type { ListingDetail } from "@/services/listings";

interface ShortletDetailsProps {
  shortletInfo: NonNullable<ListingDetail["shortletInfo"]>;
}

export function ShortletDetails({ shortletInfo }: ShortletDetailsProps) {
  const details: { icon: React.ElementType; label: string; value: string }[] = [];

  if (shortletInfo.checkInTime) {
    details.push({ icon: Clock, label: "Check-in", value: shortletInfo.checkInTime });
  }
  if (shortletInfo.checkOutTime) {
    details.push({ icon: Clock, label: "Check-out", value: shortletInfo.checkOutTime });
  }
  if (shortletInfo.minStayNights) {
    details.push({
      icon: CalendarDays,
      label: "Minimum stay",
      value: `${shortletInfo.minStayNights} night${shortletInfo.minStayNights !== 1 ? "s" : ""}`,
    });
  }
  if (shortletInfo.maxStayNights) {
    details.push({
      icon: CalendarDays,
      label: "Maximum stay",
      value: `${shortletInfo.maxStayNights} night${shortletInfo.maxStayNights !== 1 ? "s" : ""}`,
    });
  }
  if (shortletInfo.availableFrom) {
    details.push({
      icon: CalendarDays,
      label: "Available from",
      value: format(new Date(shortletInfo.availableFrom), "MMM d, yyyy"),
    });
  }
  if (shortletInfo.availableUntil) {
    details.push({
      icon: CalendarDays,
      label: "Available until",
      value: format(new Date(shortletInfo.availableUntil), "MMM d, yyyy"),
    });
  }
  if (shortletInfo.isInstantBookable) {
    details.push({
      icon: CheckCircle2,
      label: "Instant booking",
      value: "Available",
    });
  }

  if (details.length === 0 && !shortletInfo.houseRules) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Stay details</h2>

      {details.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {details.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border">
              <d.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{d.label}</p>
                <p className="text-sm font-medium">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {shortletInfo.houseRules && (
        <div className="space-y-2">
          <h3 className="text-base font-medium">House rules</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {shortletInfo.houseRules}
          </p>
        </div>
      )}
    </div>
  );
}
