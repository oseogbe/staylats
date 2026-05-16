import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { downloadBookingReceiptPdf } from "@/lib/shortletReceiptPdf";
import shortletBookingsService from "@/services/shortlet-bookings";
import type { BookingReceipt } from "@/services/shortlet-bookings";

/** Pending key while generating from an in‑memory receipt (e.g. post‑payment confirmation). */
export const SHORTLET_RECEIPT_INLINE_PENDING_KEY = "__staylats_receipt_inline__";

export function useShortletReceiptPdfDownload() {
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const downloadFromReceipt = useCallback(async (receipt: BookingReceipt) => {
    setPendingKey(SHORTLET_RECEIPT_INLINE_PENDING_KEY);
    try {
      await downloadBookingReceiptPdf(receipt);
    } catch {
      toast.error("Failed to generate receipt. Please try again.");
    } finally {
      setPendingKey(null);
    }
  }, []);

  const fetchAndDownloadByBookingId = useCallback(async (bookingId: string) => {
    setPendingKey(bookingId);
    try {
      const { receipt } = await shortletBookingsService.getReceipt(bookingId);
      await downloadBookingReceiptPdf(receipt);
    } catch {
      toast.error("Failed to load or generate receipt. Please try again.");
    } finally {
      setPendingKey(null);
    }
  }, []);

  return {
    isGenerating: pendingKey !== null,
    /** Reservations: matches `bookingId`. Confirmation page: equals {@link SHORTLET_RECEIPT_INLINE_PENDING_KEY}. */
    pendingKey,
    downloadFromReceipt,
    fetchAndDownloadByBookingId,
  };
}
