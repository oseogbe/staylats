import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HostBookingItem } from "@/services/shortlet-bookings";

interface BookingsCalendarProps {
  bookings: HostBookingItem[];
  onBookingClick: (booking: HostBookingItem) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
};

/** Host calendar only shows paid bookings; legend matches statuses they can see. */
const CALENDAR_LEGEND_STATUSES: (keyof typeof STATUS_COLORS)[] = ["confirmed", "cancelled"];

const DEFAULT_STATUS_STYLE = {
  bg: "bg-neutral-100",
  text: "text-neutral-700",
  border: "border-neutral-300",
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface CalendarBookingRow {
  booking: HostBookingItem;
  startCol: number;
  span: number;
  row: number;
}

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = endOfMonth(first);
  let dayOfWeek = first.getDay();
  if (dayOfWeek === 0) dayOfWeek = 7;
  const offset = dayOfWeek - 1;

  const days: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function BookingsCalendar({ bookings, onBookingClick }: BookingsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const totalWeeks = days.length / 7;

  const bookingRows = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = endOfMonth(monthStart);
    const rows: CalendarBookingRow[][] = Array.from({ length: totalWeeks }, () => []);

    const relevantBookings = bookings.filter((b) => {
      const ci = new Date(b.checkInDate);
      const co = new Date(b.checkOutDate);
      return ci <= monthEnd && co >= monthStart;
    });

    relevantBookings.sort(
      (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
    );

    for (const booking of relevantBookings) {
      const ci = new Date(booking.checkInDate);
      const co = new Date(booking.checkOutDate);

      for (let week = 0; week < totalWeeks; week++) {
        const weekStartIdx = week * 7;
        const weekStartDate = days[weekStartIdx];
        const weekEndDate = days[weekStartIdx + 6];

        if (!weekStartDate && !weekEndDate) continue;

        const wStart = weekStartDate || new Date(year, month, 1);
        const lastDayInMonth = endOfMonth(new Date(year, month, 1));
        const wEnd = weekEndDate || lastDayInMonth;

        if (ci > wEnd || co < wStart) continue;

        const visibleStart = ci < wStart ? wStart : ci;
        const visibleEnd = co > wEnd ? wEnd : co;

        let startCol = -1;
        let endCol = -1;
        for (let i = 0; i < 7; i++) {
          const day = days[weekStartIdx + i];
          if (!day) continue;
          if (isSameDay(day, visibleStart) || (startCol === -1 && day >= visibleStart)) {
            startCol = i;
          }
          if (day <= visibleEnd) {
            endCol = i;
          }
        }

        if (startCol === -1 || endCol === -1 || endCol < startCol) continue;

        const span = endCol - startCol + 1;

        let rowIdx = 0;
        while (true) {
          const occupied = rows[week].some(
            (existing) =>
              existing.row === rowIdx &&
              !(startCol >= existing.startCol + existing.span || startCol + span <= existing.startCol)
          );
          if (!occupied) break;
          rowIdx++;
        }

        rows[week].push({ booking, startCol, span, row: rowIdx });
      }
    }

    return rows;
  }, [bookings, year, month, days, totalWeeks]);

  const maxRows = useMemo(
    () => bookingRows.map((weekRows) => (weekRows.length > 0 ? Math.max(...weekRows.map((r) => r.row)) + 1 : 0)),
    [bookingRows]
  );

  const today = new Date();
  const isToday = (d: Date | null) => d != null && isSameDay(d, today);

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({ length: totalWeeks }).map((_, weekIdx) => {
          const weekDays = days.slice(weekIdx * 7, weekIdx * 7 + 7);
          const rowCount = maxRows[weekIdx];
          const bookingRowHeight = rowCount * 26;

          return (
            <div
              key={weekIdx}
              className={`${weekIdx < totalWeeks - 1 ? "border-b border-neutral-200" : ""}`}
            >
              {/* Day numbers row */}
              <div className="grid grid-cols-7">
                {weekDays.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`min-h-[32px] px-1.5 pt-1 text-right ${
                      dayIdx < 6 ? "border-r border-neutral-100" : ""
                    } ${!day ? "bg-neutral-50/50" : ""}`}
                  >
                    {day && (
                      <span
                        className={`text-xs inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday(day)
                            ? "bg-primary text-white font-bold"
                            : "text-neutral-700"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Booking bars */}
              {rowCount > 0 && (
                <div
                  className="relative px-0.5"
                  style={{ height: `${bookingRowHeight + 4}px` }}
                >
                  {bookingRows[weekIdx].map((entry, entryIdx) => {
                    const colors = STATUS_COLORS[entry.booking.status] || DEFAULT_STATUS_STYLE;
                    const leftPct = (entry.startCol / 7) * 100;
                    const widthPct = (entry.span / 7) * 100;

                    return (
                      <button
                        key={`${entry.booking.id}-${weekIdx}-${entryIdx}`}
                        className={`absolute rounded-md px-1.5 text-[11px] leading-none font-medium truncate cursor-pointer
                          ${colors.bg} ${colors.text} border ${colors.border}
                          hover:opacity-80 transition-opacity`}
                        style={{
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          top: `${entry.row * 26 + 2}px`,
                          height: "22px",
                          lineHeight: "22px",
                        }}
                        onClick={() => onBookingClick(entry.booking)}
                        title={`${entry.booking.guest.firstName} ${entry.booking.guest.lastName} — ${entry.booking.listing.title}`}
                      >
                        {entry.booking.guest.firstName} {entry.booking.guest.lastName[0]}.
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs">
        {CALENDAR_LEGEND_STATUSES.map((status) => {
          const colors = STATUS_COLORS[status];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`} />
              <span className="text-neutral-600 capitalize">{status.replace("_", " ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
