import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import type { BookingReceipt } from "@/services/shortlet-bookings";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND = "#F59E0B";
const BRAND_DARK = "#B45309";
const BRAND_LIGHT = "#FEF3C7";
const SUCCESS = "#16A34A";
const SUCCESS_BG = "#DCFCE7";
const GRAY_50 = "#F9FAFB";
const GRAY_100 = "#F3F4F6";
const GRAY_200 = "#E5E7EB";
const GRAY_400 = "#9CA3AF";
const GRAY_600 = "#4B5563";
const GRAY_900 = "#111827";
const WHITE = "#FFFFFF";

Font.registerHyphenationCallback((word) => [word]);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: GRAY_900,
    paddingTop: 0,
    paddingBottom: 40,
  },

  // ── Header band ──────────────────────────────────────────────────────────
  headerBand: {
    backgroundColor: GRAY_900,
    paddingHorizontal: 48,
    paddingTop: 36,
    paddingBottom: 32,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND,
    marginRight: 7,
    marginTop: 2,
  },
  logoText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: BRAND,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 9,
    color: GRAY_400,
    letterSpacing: 0.3,
  },

  // ── Status bar under header ────────────────────────────────────────────
  statusBar: {
    backgroundColor: BRAND,
    paddingHorizontal: 48,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SUCCESS_BG,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 5,
  },
  statusText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: SUCCESS,
    letterSpacing: 0.3,
  },
  receiptLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: GRAY_900,
    letterSpacing: 0.2,
  },

  // ── Body ──────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 48,
  },

  // ── Meta row ─────────────────────────────────────────────────────────
  metaGrid: {
    flexDirection: "row",
    marginTop: 28,
    marginBottom: 24,
    gap: 0,
  },
  metaCell: {
    flex: 1,
    paddingRight: 12,
  },
  metaCellRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 8,
    color: GRAY_400,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: GRAY_900,
  },
  metaValueMono: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: GRAY_600,
  },

  divider: {
    height: 1,
    backgroundColor: GRAY_200,
    marginVertical: 20,
  },
  dividerLight: {
    height: 1,
    backgroundColor: GRAY_100,
    marginVertical: 12,
  },

  // ── Section headings ─────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND_DARK,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  // ── Property card ──────────────────────────────────────────────────
  propertyCard: {
    backgroundColor: GRAY_50,
    borderRadius: 8,
    padding: 16,
    marginBottom: 6,
  },
  propertyTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: GRAY_900,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 9,
    color: GRAY_600,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  stayRow: {
    flexDirection: "row",
    gap: 0,
  },
  stayItem: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
  },
  stayItemLast: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 6,
    padding: 10,
  },
  stayItemLabel: {
    fontSize: 8,
    color: GRAY_400,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  stayItemValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: GRAY_900,
  },

  // ── Line items ────────────────────────────────────────────────────
  lineItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  lineItemLabel: {
    fontSize: 10,
    color: GRAY_600,
  },
  lineItemAmount: {
    fontSize: 10,
    color: GRAY_900,
    fontFamily: "Helvetica",
  },

  // ── Total ─────────────────────────────────────────────────────────
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BRAND_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: GRAY_900,
  },
  totalAmount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: BRAND_DARK,
  },

  // ── Payment meta ──────────────────────────────────────────────────
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 4,
  },
  paymentItem: {
    width: "50%",
    marginBottom: 14,
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    paddingHorizontal: 48,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  footerLeft: {
    fontSize: 8,
    color: GRAY_400,
    lineHeight: 1.6,
  },
  footerRight: {
    fontSize: 8,
    color: GRAY_400,
    textAlign: "right",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const titleCase = (str: string | null) => {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  receipt: BookingReceipt;
}

const ShortletReceiptPDF = ({ receipt }: Props) => {
  const { listing, stay, lineItems, totals, payment } = receipt;
  const address = listing.address || listing.location;

  return (
    <Document
      title={`Staylats Receipt – ${receipt.receiptNumber}`}
      author="Staylats"
      subject="Booking Payment Receipt"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header band ──────────────────────────────────────── */}
        <View style={s.headerBand}>
          <View style={s.logoRow}>
            <View style={s.logoDot} />
            <Text style={s.logoText}>STAYLATS</Text>
          </View>
          <Text style={s.tagline}>Short-let & rental booking platform</Text>
        </View>

        {/* ── Status bar ───────────────────────────────────────── */}
        <View style={s.statusBar}>
          <Text style={s.receiptLabel}>Payment Receipt</Text>
          <View style={s.statusBadge}>
            <View style={s.statusDot} />
            <Text style={s.statusText}>PAYMENT SUCCESSFUL</Text>
          </View>
        </View>

        {/* ── Body ─────────────────────────────────────────────── */}
        <View style={s.body}>
          {/* Meta grid */}
          <View style={s.metaGrid}>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Receipt No.</Text>
              <Text style={s.metaValue}>{receipt.receiptNumber}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Booking ID</Text>
              <Text style={s.metaValueMono}>{receipt.bookingId.slice(0, 13)}…</Text>
            </View>
            <View style={s.metaCellRight}>
              <Text style={s.metaLabel}>Issued</Text>
              <Text style={s.metaValue}>{fmtDateTime(payment?.paidAt ?? null)}</Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Property */}
          <Text style={s.sectionLabel}>Property</Text>
          <View style={s.propertyCard}>
            <Text style={s.propertyTitle}>{listing.title}</Text>
            <Text style={s.propertyAddress}>{address}</Text>

            <View style={s.stayRow}>
              <View style={s.stayItem}>
                <Text style={s.stayItemLabel}>Check-in</Text>
                <Text style={s.stayItemValue}>{fmtDate(stay.checkInDate)}</Text>
              </View>
              <View style={s.stayItem}>
                <Text style={s.stayItemLabel}>Check-out</Text>
                <Text style={s.stayItemValue}>{fmtDate(stay.checkOutDate)}</Text>
              </View>
              <View style={s.stayItemLast}>
                <Text style={s.stayItemLabel}>Duration</Text>
                <Text style={s.stayItemValue}>
                  {stay.numberOfNights} {stay.numberOfNights === 1 ? "night" : "nights"}
                </Text>
              </View>
            </View>
          </View>

          <View style={s.divider} />

          {/* Pricing */}
          <Text style={s.sectionLabel}>Pricing breakdown</Text>

          {lineItems.map((item, i) => (
            <View key={item.label}>
              <View style={s.lineItemRow}>
                <Text style={s.lineItemLabel}>{item.label}</Text>
                <Text style={s.lineItemAmount}>
                  {fmt(item.amount, totals.currency)}
                </Text>
              </View>
              {i < lineItems.length - 1 && <View style={s.dividerLight} />}
            </View>
          ))}

          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total paid</Text>
            <Text style={s.totalAmount}>{fmt(totals.totalPaid, totals.currency)}</Text>
          </View>

          {payment && (
            <>
              <View style={s.divider} />

              <Text style={s.sectionLabel}>Payment details</Text>
              <View style={s.paymentGrid}>
                <View style={s.paymentItem}>
                  <Text style={s.metaLabel}>Reference</Text>
                  <Text style={s.metaValueMono}>{payment.reference}</Text>
                </View>
                <View style={s.paymentItem}>
                  <Text style={s.metaLabel}>Status</Text>
                  <Text style={s.metaValue}>{titleCase(payment.status)}</Text>
                </View>
                {payment.method && (
                  <View style={s.paymentItem}>
                    <Text style={s.metaLabel}>Method</Text>
                    <Text style={s.metaValue}>{titleCase(payment.method)}</Text>
                  </View>
                )}
                <View style={s.paymentItem}>
                  <Text style={s.metaLabel}>Paid at</Text>
                  <Text style={s.metaValue}>{fmtDateTime(payment.paidAt)}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* ── Footer ───────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerLeft}>
            {"This is your official payment receipt from Staylats.\nPlease retain it for your records."}
          </Text>
          <Text style={s.footerRight}>
            {"staylats.com\nsupport@staylats.com"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ShortletReceiptPDF;
