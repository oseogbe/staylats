import { useMutation, useQuery } from '@tanstack/react-query'

import shortletBookingsService from '@/services/shortlet-bookings'
import type { InitializeShortletPaymentPayload, ShortletGuestCounts, HostBookingItem } from '@/services/shortlet-bookings'

export const useCheckShortletAvailability = () =>
  useMutation({
    mutationFn: (payload: {
      listingId: string
      checkInDate: string
      checkOutDate: string
      guests: ShortletGuestCounts
    }) =>
      shortletBookingsService.checkAvailability(payload.listingId, {
        checkInDate: payload.checkInDate,
        checkOutDate: payload.checkOutDate,
        guests: payload.guests,
      }),
  })

export const useInitializeShortletPayment = () =>
  useMutation({
    mutationFn: (payload: InitializeShortletPaymentPayload) =>
      shortletBookingsService.initializePayment(payload),
  })

export const useVerifyShortletPayment = (payload: {
  txRef?: string
  transactionId?: string
  gatewayStatus?: string
}) =>
  useQuery({
    queryKey: [
      'shortlet-payment-verification',
      payload.txRef,
      payload.transactionId,
      payload.gatewayStatus,
    ],
    queryFn: () => shortletBookingsService.verifyPayment(payload),
    enabled: Boolean(payload.txRef || payload.transactionId),
    retry: 1,
    staleTime: 0,
  })

export const useHostShortletBookings = (userId: string | undefined) =>
  useQuery<{ bookings: HostBookingItem[] }>({
    queryKey: ['hostShortletBookings', userId],
    queryFn: () => shortletBookingsService.getHostBookings(),
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  })

