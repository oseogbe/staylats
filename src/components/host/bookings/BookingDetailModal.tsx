import {
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  Users,
  CreditCard,
  MessageSquare,
  Moon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { HostBookingItem } from "@/services/shortlet-bookings";

interface BookingDetailModalProps {
  booking: HostBookingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function BookingDetailModal({ booking, open, onOpenChange }: BookingDetailModalProps) {
  if (!booking) return null;

  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const guestCount = booking.guest.adults + booking.guest.children + booking.guest.infants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Booking Details</DialogTitle>
        </DialogHeader>

        {/* Listing Info */}
        <div className="flex gap-3 items-start">
          {booking.listing.image ? (
            <img
              src={booking.listing.image}
              alt={booking.listing.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-6 h-6 text-neutral-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-neutral-900 break-words">
              {booking.listing.title}
            </h3>
            <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{booking.listing.address}, {booking.listing.city}, {booking.listing.state}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className={statusCfg.className}>
            booking {statusCfg.label.toLowerCase()}
          </Badge>
        </div>

        <Separator />

        {/* Booking Period */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> Stay Period
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-neutral-500 text-xs mb-0.5">Check-in</p>
              <p className="font-medium text-neutral-900">{formatDate(booking.checkInDate)}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-neutral-500 text-xs mb-0.5">Check-out</p>
              <p className="font-medium text-neutral-900">{formatDate(booking.checkOutDate)}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-1.5 flex items-center gap-1">
            <Moon className="w-3.5 h-3.5" />
            {booking.numberOfNights} {booking.numberOfNights === 1 ? "night" : "nights"}
          </p>
        </div>

        <Separator />

        {/* Guest Details */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4" /> Guest Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-900">{booking.guest.firstName} {booking.guest.lastName}</span>
            </div>
            {booking.guest.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${booking.guest.email}`} className="text-primary hover:underline">
                  {booking.guest.email}
                </a>
              </div>
            )}
            {booking.guest.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <a href={`tel:${booking.guest.phone}`} className="text-primary hover:underline">
                  {booking.guest.phone}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-600">
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
                <span className="text-neutral-400 mx-1">·</span>
                {booking.guest.adults} {booking.guest.adults === 1 ? "adult" : "adults"}
                {booking.guest.children > 0 && <>, {booking.guest.children} {booking.guest.children === 1 ? "child" : "children"}</>}
                {booking.guest.infants > 0 && <>, {booking.guest.infants} {booking.guest.infants === 1 ? "infant" : "infants"}</>}
                {booking.guest.pets > 0 && <>, {booking.guest.pets} {booking.guest.pets === 1 ? "pet" : "pets"}</>}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" /> Payment
          </h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {formatCurrency(booking.pricePerNight)} × {booking.numberOfNights} {booking.numberOfNights === 1 ? "night" : "nights"}
              </span>
              <span className="text-neutral-900">{formatCurrency(booking.subtotal)}</span>
            </div>
            {booking.cleaningFee != null && booking.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Cleaning fee</span>
                <span className="text-neutral-900">{formatCurrency(booking.cleaningFee)}</span>
              </div>
            )}
            {booking.serviceFee != null && booking.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Service fee</span>
                <span className="text-neutral-900">{formatCurrency(booking.serviceFee)}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span className="text-neutral-900">Total</span>
              <span className="text-neutral-900">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Special Requests
              </h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                {booking.specialRequests}
              </p>
            </div>
          </>
        )}

        <p className="text-xs text-neutral-400 text-center pt-1">
          Booked on {formatDate(booking.createdAt)}
        </p>
      </DialogContent>
    </Dialog>
  );
}
