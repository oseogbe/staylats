import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthYearCalendarProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function MonthYearCalendar({
  value,
  onChange,
  placeholder = "Pick a date",
  minDate = new Date("1900-01-01"),
  maxDate = new Date(),
}: MonthYearCalendarProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(value || new Date());

  const handleMonthChange = (increment: boolean) => {
    const newDate = increment ? addMonths(calendarDate, 1) : subMonths(calendarDate, 1);
    setCalendarDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (
            format(value, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex justify-center gap-2 pb-4">
            <Select
              onValueChange={(month) => {
                const newDate = new Date(calendarDate);
                newDate.setMonth(MONTHS.indexOf(month));
                setCalendarDate(newDate);
                if (value) {
                  const fieldDate = new Date(value);
                  fieldDate.setMonth(MONTHS.indexOf(month));
                  onChange(fieldDate);
                }
              }}
              value={MONTHS[calendarDate.getMonth()]}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(year) => {
                const newDate = new Date(calendarDate);
                newDate.setFullYear(parseInt(year));
                setCalendarDate(newDate);
                if (value) {
                  const fieldDate = new Date(value);
                  fieldDate.setFullYear(parseInt(year));
                  onChange(fieldDate);
                }
              }}
              value={calendarDate.getFullYear().toString()}
            >
              <SelectTrigger className="w-[95px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 124 }, 
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            month={calendarDate}
            selected={value}
            onSelect={(date) => {
              onChange(date);
              if (date) {
                setCalendarDate(date);
              }
            }}
            onMonthChange={(date) => {
              setCalendarDate(date);
            }}
            disabled={(date) =>
              date > maxDate || date < minDate
            }
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}