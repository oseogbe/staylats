import { pdf } from "@react-pdf/renderer";

import ShortletReceiptPDF from "@/components/receipts/ShortletReceiptPDF";
import type { BookingReceipt } from "@/services/shortlet-bookings";

/**
 * Renders a booking receipt as a PDF and triggers a browser download.
 * Stateless — safe to call from hooks, pages, or event handlers.
 */
export async function downloadBookingReceiptPdf(
  receipt: BookingReceipt
): Promise<void> {
  const blob = await pdf(<ShortletReceiptPDF receipt={receipt} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `staylats-receipt-${receipt.receiptNumber}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
