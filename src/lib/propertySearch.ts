import { format, isValid, parse } from "date-fns";

/**
 * Search params are date-only (`yyyy-MM-dd`) so URLs stay readable and
 * shareable. They are parsed back to *local* midnight — the same basis the
 * booking flow uses when it sends `checkIn.toISOString()` — so a listing that
 * looks available in search cannot fail the availability check at checkout.
 */
export const SEARCH_DATE_FORMAT = "yyyy-MM-dd";

export const toSearchDate = (date: Date) => format(date, SEARCH_DATE_FORMAT);

export const fromSearchDate = (value: string | null | undefined): Date | undefined => {
  if (!value) return undefined;
  const parsed = parse(value, SEARCH_DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
};

/** The API takes ISO strings; keep the local-midnight basis when converting. */
export const toApiDate = (date: Date | undefined) =>
  date ? date.toISOString() : undefined;

export interface PropertySearchCriteria {
  type?: "shortlet" | "rental";
  /** Abuja or Lagos - listings hold these as their state, not their city. */
  state?: string;
  checkIn?: Date;
  checkOut?: Date;
  /** Adults + children */
  guests?: number;
}

/**
 * Build the `/properties` query string for a search. Dates are only emitted as
 * a pair — the API rejects a lone bound, since one date would widen the search
 * rather than narrow it.
 */
export const buildPropertySearchParams = ({
  type,
  state,
  checkIn,
  checkOut,
  guests,
}: PropertySearchCriteria): URLSearchParams => {
  const params = new URLSearchParams();

  if (type) params.set("type", type);
  if (state) params.set("state", state);
  if (checkIn && checkOut) {
    params.set("checkIn", toSearchDate(checkIn));
    params.set("checkOut", toSearchDate(checkOut));
  }
  if (guests && guests > 1) params.set("guests", String(guests));

  return params;
};
