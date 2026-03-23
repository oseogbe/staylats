import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock3, Loader2, MapPin, ReceiptText, RefreshCw, BedDouble } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import shortletBookingsService from '@/services/shortlet-bookings'

const formatAmount = (value: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)

const BOOKING_STATUS_BADGE: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-neutral-100 text-neutral-700',
  refunded: 'bg-purple-100 text-purple-800',
}

const ReservationsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['my-shortlet-reservations', user?.id],
    enabled: !!user?.id,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      shortletBookingsService.getMyReservations({
        cursor: pageParam,
        limit: 8,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  })

  const reservations = useMemo(
    () => data?.pages.flatMap((page) => page.reservations) || [],
    [data]
  )
  const recommendations = data?.pages[0]?.recommendations || []

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Reservations</CardTitle>
            <CardDescription>
              Track your shortlet booking history and discover places to stay next.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            {(error as any)?.response?.data?.message || 'Failed to load reservations.'}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No reservations yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your shortlet bookings will appear here once you complete payment.
            </p>
            <Button className="mt-5" onClick={() => navigate('/properties?type=shortlet')}>
              Browse Shortlets
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-xl border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{reservation.listing.title}</h3>
                    <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{reservation.listing.address}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={PAYMENT_STATUS_BADGE[reservation.paymentStatus] || 'bg-neutral-100 text-neutral-700'}
                    >
                      payment {reservation.paymentStatus}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={BOOKING_STATUS_BADGE[reservation.status] || 'bg-neutral-100 text-neutral-700'}
                    >
                      booking {reservation.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(reservation.checkInDate).toLocaleDateString()} -{' '}
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    <span>{reservation.numberOfNights} nights</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <ReceiptText className="h-4 w-4" />
                    <span>{formatAmount(reservation.totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/property/${reservation.listing.slug}`)}
                  >
                    View listing
                  </Button>
                </div>
              </div>
            ))}

            <div ref={loadMoreRef} />

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more reservations...
              </div>
            )}
          </div>
        )}

        {recommendations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Recommended for your next stay</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/property/${item.slug}`)}
                >
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h4 className="line-clamp-2 font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                    <p className="text-sm font-medium">
                      {formatAmount(item.pricePerNight)} <span className="text-muted-foreground">/ night</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

export default ReservationsPage
