import { ReactNode } from "react";
import { format, startOfToday } from "date-fns";
import type { DateRange as DayPickerRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DateRange {
  checkIn?: Date;
  checkOut?: Date;
}

/** `12 Aug – 15 Aug`, or `emptyLabel` until both ends are picked. */
export const formatDateRange = (range: DateRange, emptyLabel: string) =>
  range.checkIn && range.checkOut
    ? `${format(range.checkIn, "d MMM")} – ${format(range.checkOut, "d MMM")}`
    : emptyLabel;

export const isCompleteRange = (range: DateRange) =>
  Boolean(range.checkIn && range.checkOut);

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /**
   * The trigger element. Rendered as the popover's anchor so each host can
   * style it to match its own form - the picker only owns the calendar.
   */
  children: ReactNode;
  align?: "start" | "center" | "end";
}

/**
 * Check-in and check-out picked as one range across two months.
 *
 * A single range calendar rather than two independent ones: side-by-side
 * single-date calendars both open on the same month, so the natural
 * click-start-then-click-end gesture lands twice in the same calendar and only
 * ever moves check-in, never completing a range.
 *
 * Past days are never selectable, and a same-day pair is held open as a
 * check-in rather than accepted - a zero-night stay is rejected by both the
 * availability search and the booking flow.
 */
export function DateRangePicker({
  value,
  onChange,
  children,
  align = "start",
}: DateRangePickerProps) {
  const today = startOfToday();

  // The popover stays open on selection - the range highlight and the summary
  // above are the feedback, and dismissing is the user's call.
  const handleSelect = (range: DayPickerRange | undefined) => {
    const checkIn = range?.from;
    const checkOut =
      checkIn && range?.to && range.to > checkIn ? range.to : undefined;

    onChange({ checkIn, checkOut });
  };

  const summary = (label: string, date: Date | undefined) => (
    <div className="text-center">
      <p className="text-xs font-medium text-neutral-500 uppercase">{label}</p>
      <p className={date ? "text-sm font-medium" : "text-sm text-neutral-400"}>
        {date ? format(date, "d MMM yyyy") : "Add date"}
      </p>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      {/* The two months stack on narrow screens, so cap the height and scroll */}
      <PopoverContent
        align={align}
        className="w-auto p-4 max-h-[80vh] overflow-y-auto"
        sideOffset={8}
      >
        {/* Two equal columns with the calendar's own gap, so each summary sits
            centred over its month; they stack with the months on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-primary/70 mb-3">
          {summary("Check in", value.checkIn)}
          {summary("Check out", value.checkOut)}
        </div>

        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={value.checkIn ?? today}
          selected={{ from: value.checkIn, to: value.checkOut }}
          onSelect={handleSelect}
          disabled={{ before: today }}
          className="p-0 pointer-events-auto"
        />

        {(value.checkIn || value.checkOut) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3"
            onClick={() => onChange({})}
          >
            Clear dates
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
