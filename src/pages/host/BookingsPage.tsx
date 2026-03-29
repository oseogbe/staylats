import { useState, useMemo } from "react";
import { CalendarDays, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingsCalendar } from "@/components/host/bookings/BookingsCalendar";
import { BookingDetailModal } from "@/components/host/bookings/BookingDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { useHostShortletBookings } from "@/hooks/use-shortlet-bookings";
import type { HostBookingItem } from "@/services/shortlet-bookings";

type ViewMode = "calendar" | "list";
type BookingFilter = "all" | "current" | "upcoming" | "past";

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function filterBookings(bookings: HostBookingItem[], filter: BookingFilter): HostBookingItem[] {
  const today = startOfDay(new Date());

  switch (filter) {
    case "current":
      return bookings.filter((b) => {
        const checkIn = startOfDay(new Date(b.checkInDate));
        const checkOut = startOfDay(new Date(b.checkOutDate));
        return checkIn <= today && checkOut > today;
      });
    case "upcoming":
      return bookings.filter((b) => startOfDay(new Date(b.checkInDate)) > today);
    case "past":
      return bookings.filter((b) => startOfDay(new Date(b.checkOutDate)) <= today);
    default:
      return bookings;
  }
}

const BookingsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [statusFilter, setStatusFilter] = useState<BookingFilter>("all");
  const [selectedBooking, setSelectedBooking] = useState<HostBookingItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useHostShortletBookings(user?.id);
  const allBookings = data?.bookings || [];

  const filteredBookings = useMemo(
    () => filterBookings(allBookings, statusFilter),
    [allBookings, statusFilter]
  );

  const handleBookingClick = (booking: HostBookingItem) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Bookings</h2>
          <p className="text-neutral-600 mt-1">
            View and manage bookings for your shortlet listings.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-[400px] w-full rounded-lg" />
              </div>
            ) : (
              <BookingsCalendar
                bookings={allBookings}
                onBookingClick={handleBookingClick}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as BookingFilter)}
        >
          <TabsList className="bg-neutral-100">
            {(["all", "current", "upcoming", "past"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-white capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {(["all", "current", "upcoming", "past"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === "all" ? "All Bookings" : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings`}
                  </CardTitle>
                  <CardDescription>
                    {tab === "all"
                      ? "A complete list of all bookings across your shortlet listings."
                      : tab === "current"
                        ? "Bookings with an active stay right now."
                        : tab === "upcoming"
                          ? "Bookings that haven't started yet."
                          : "Bookings that have already ended."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <EmptyState tab={tab} />
                  ) : (
                    <BookingsList
                      bookings={filteredBookings}
                      onBookingClick={handleBookingClick}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <BookingDetailModal
        booking={selectedBooking}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

function EmptyState({ tab }: { tab?: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <CalendarDays className="w-6 h-6 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {tab && tab == "all" && "No bookings yet."}
      </h3>
      <p className="text-neutral-600">
        {tab && tab == "all" && "Bookings will appear here once guests start booking your shortlet listings."}
      </p>
    </div>
  );
}

function BookingsList({
  bookings,
  onBookingClick,
}: {
  bookings: HostBookingItem[];
  onBookingClick: (booking: HostBookingItem) => void;
}) {
  return (
    <div className="space-y-2">
      {bookings.map((booking) => {
        const statusClass = STATUS_BADGE[booking.status] || "bg-neutral-100 text-neutral-700";

        return (
          <button
            key={booking.id}
            className="w-full flex items-start justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors text-left"
            onClick={() => onBookingClick(booking)}
          >
            <div className="flex min-w-0 flex-1 gap-3">
              {booking.listing.image ? (
                <img
                  src={booking.listing.image}
                  alt={booking.listing.title}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <CalendarDays className="h-5 w-5 text-neutral-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 break-words line-clamp-2">
                  {booking.guest.firstName} {booking.guest.lastName}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 break-words line-clamp-3">
                  {booking.listing.title}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  <span className="whitespace-normal">
                    {new Date(booking.checkInDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" – "}
                    {new Date(booking.checkOutDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="mx-1">·</span>
                  {booking.numberOfNights} {booking.numberOfNights === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
              <Badge variant="secondary" className={`whitespace-nowrap text-[11px] capitalize ${statusClass}`}>
                {booking.status.replace(/_/g, " ")}
              </Badge>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                ₦{booking.totalPrice.toLocaleString("en-NG", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default BookingsPage;
