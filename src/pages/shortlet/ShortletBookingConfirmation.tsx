import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useVerifyShortletPayment } from "@/hooks/use-shortlet-bookings";
import shortletBookingsService from "@/services/shortlet-bookings";

const formatAmount = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);

const ShortletBookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef") || undefined;
  const transactionId = searchParams.get("transaction_id") || undefined;
  const status = (searchParams.get("status") || "").toLowerCase();
  const listingSlugFromUrl = searchParams.get("listingSlug") || undefined;
  const isGatewayCancelled = status === "cancelled";
  const cancelHandled = useRef(false);

  useEffect(() => {
    if (!isGatewayCancelled || cancelHandled.current) return;
    cancelHandled.current = true;

    if (txRef) {
      shortletBookingsService
        .verifyPayment({ txRef, gatewayStatus: status })
        .catch(() => {});
    }

    const slug = listingSlugFromUrl;
    if (slug) {
      toast.error("Payment cancelled");
      navigate(`/property/${slug}`, { replace: true });
    } else {
      toast.error("Payment cancelled");
      navigate("/properties", { replace: true });
    }
  }, [isGatewayCancelled, txRef, status, listingSlugFromUrl, navigate]);

  const skipVerification = isGatewayCancelled;

  const { data, isLoading, isError, error, refetch } = useVerifyShortletPayment({
    txRef: skipVerification ? undefined : txRef,
    transactionId: skipVerification ? undefined : transactionId,
    gatewayStatus: skipVerification ? undefined : status || undefined,
  });

  const paymentStatus = useMemo(() => {
    const backendStatus = String(data?.paymentStatus || "").toLowerCase();
    if (backendStatus) return backendStatus;
    if (isGatewayCancelled) return "cancelled";
    return status === "successful" ? "pending" : "failed";
  }, [data?.paymentStatus, status, isGatewayCancelled]);

  const receipt = data?.receipt;
  const redirectSlug = receipt?.listing?.slug || listingSlugFromUrl;

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staylats-receipt-${receipt.receiptNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!txRef && !transactionId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-2xl mx-auto p-8 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">Payment reference missing</p>
          </div>
          <p className="text-sm text-muted-foreground">
            We could not find a payment reference in the callback URL.
          </p>
          <Button onClick={() => navigate("/properties")}>Browse properties</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="text-center space-y-2">
          {isLoading ? (
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          ) : paymentStatus === "success" ? (
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
          ) : (
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          )}

          <h1 className="text-2xl font-bold">Booking payment confirmation</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "We are verifying your payment..."
              : paymentStatus === "success"
                ? "Your shortlet payment has been confirmed."
                : "We could not confirm your payment yet."}
          </p>
        </div>

        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            {(error as any)?.response?.data?.message || "Payment verification failed."}
          </div>
        )}

        {receipt && (
          <>
            <Separator />
            <div className="space-y-2">
              <h2 className="font-semibold">{receipt.listing.title}</h2>
              {paymentStatus === "success" && receipt.listing.address ? (
                <p className="text-sm text-muted-foreground">{receipt.listing.address}</p>
              ) : (
                <p className="text-sm text-muted-foreground">{receipt.listing.location}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {new Date(receipt.stay.checkInDate).toLocaleDateString()} -{" "}
                {new Date(receipt.stay.checkOutDate).toLocaleDateString()} (
                {receipt.stay.numberOfNights} nights)
              </p>
            </div>

            <div className="space-y-2 text-sm">
              {receipt.lineItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>{formatAmount(item.amount, receipt.totals.currency)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total paid</span>
                <span>
                  {formatAmount(receipt.totals.totalPaid, receipt.totals.currency)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => refetch()} disabled={isLoading}>
            Re-check status
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-account/reservations')}>
            View reservations
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadReceipt}
            disabled={!receipt}
          >
            Download receipt
          </Button>
          {redirectSlug ? (
            <Button variant="ghost" asChild>
              <Link to={`/property/${redirectSlug}`}>Back to listing</Link>
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/properties")}>
              Browse properties
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShortletBookingConfirmation;

