/** Largest unit first would round everything up; smallest first keeps "2 minutes ago" honest. */
const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * "just now", "2 minutes ago", "3 hours ago", "yesterday", "last month".
 *
 * Returns an empty string for a missing or unparseable date so a caller can
 * render nothing, rather than a fabricated timestamp - a row that says "this
 * minute" when it has no date at all reads as real.
 */
export const formatRelativeTime = (value: string | Date | null | undefined): string => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  let duration = (date.getTime() - Date.now()) / 1000;
  if (Math.abs(duration) < 45) return "just now";

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return date.toLocaleDateString();
};
