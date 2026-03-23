import api from './index'

export interface ShortletGuestCounts {
  adults: number
  children: number
  infants: number
  pets: number
}

export interface InitializeShortletPaymentPayload {
  listingId: string
  checkInDate: string
  checkOutDate: string
  guests: ShortletGuestCounts
  specialRequests?: string
  callbackUrl?: string
  idempotencyKey?: string
}

export interface ShortletAvailabilityResponse {
  isAvailable: boolean
  listingId: string
  nights: number
  currency: string
  bookingMode: 'instant' | 'request'
  subtotal: number
  cleaningFee: number
  securityDeposit: number
  serviceFee: number
  totalPrice: number
  hostShareAmount: number
  platformCommissionAmount: number
}

export interface InitializePaymentResponse {
  bookingId: string
  paymentId: string
  txRef: string
  checkoutUrl: string
  amount: number
  currency: string
  bookingMode: 'instant' | 'request'
}

export interface ReceiptLineItem {
  label: string
  amount: number
}

export interface BookingReceipt {
  receiptNumber: string
  bookingId: string
  listing: {
    title: string
    slug: string
    location: string
    address?: string
  }
  stay: {
    checkInDate: string
    checkOutDate: string
    numberOfNights: number
  }
  lineItems: ReceiptLineItem[]
  totals: {
    totalPaid: number
    currency: string
    hostShareAmount: number
    platformCommissionAmount: number
  }
  payment: {
    paymentId: string
    reference: string
    status: 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled'
    paidAt: string | null
    method: string | null
  } | null
}

export interface VerifyShortletPaymentResponse {
  bookingId: string
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled'
  bookingStatus: string
  txRef: string
  alreadyFinalized: boolean
  receipt: BookingReceipt
}

export interface ReservationHistoryItem {
  id: string
  status: string
  checkInDate: string
  checkOutDate: string
  numberOfNights: number
  totalPrice: number
  createdAt: string
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled'
  paymentReference: string | null
  paidAt: string | null
  listing: {
    id: string
    slug: string
    title: string
    location: string
    address: string
    image: string
    pricePerNight: number
  }
}

export interface ReservationRecommendationItem {
  id: string
  slug: string
  title: string
  location: string
  image: string
  pricePerNight: number
}

export interface ReservationHistoryResponse {
  reservations: ReservationHistoryItem[]
  nextCursor: string | null
  hasMore: boolean
  recommendations: ReservationRecommendationItem[]
}

export interface HostBookingGuest {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  adults: number
  children: number
  infants: number
  pets: number
}

export interface HostBookingListing {
  id: string
  title: string
  slug: string
  address: string
  city: string
  state: string
  image: string
}

export interface HostBookingItem {
  id: string
  checkInDate: string
  checkOutDate: string
  numberOfNights: number
  pricePerNight: number
  subtotal: number
  serviceFee: number | null
  cleaningFee: number | null
  totalPrice: number
  status: string
  specialRequests: string | null
  createdAt: string
  guest: HostBookingGuest
  listing: HostBookingListing
}

export default {
  checkAvailability: async (
    listingId: string,
    payload: {
      checkInDate: string
      checkOutDate: string
      guests: ShortletGuestCounts
    }
  ): Promise<ShortletAvailabilityResponse> => {
    const res = await api.post(`/shortlets/${listingId}/availability/check`, payload)
    return res.data.data
  },

  initializePayment: async (
    payload: InitializeShortletPaymentPayload
  ): Promise<InitializePaymentResponse> => {
    const headers: Record<string, string> = {}
    if (payload.idempotencyKey) {
      headers['x-idempotency-key'] = payload.idempotencyKey
    }

    const res = await api.post(
      `/shortlets/${payload.listingId}/bookings/initialize-payment`,
      {
        checkInDate: payload.checkInDate,
        checkOutDate: payload.checkOutDate,
        guests: payload.guests,
        specialRequests: payload.specialRequests,
        callbackUrl: payload.callbackUrl,
      },
      { headers }
    )
    return res.data.data
  },

  verifyPayment: async (payload: {
    txRef?: string
    transactionId?: string
    gatewayStatus?: string
  }): Promise<VerifyShortletPaymentResponse> => {
    const res = await api.post('/shortlets/bookings/verify-payment', payload)
    return res.data.data
  },

  getBooking: async (bookingId: string) => {
    const res = await api.get(`/shortlets/bookings/${bookingId}`)
    return res.data.data
  },

  getReceipt: async (bookingId: string): Promise<{ receipt: BookingReceipt }> => {
    const res = await api.get(`/shortlets/bookings/${bookingId}/receipt`)
    return res.data.data
  },

  getMyReservations: async (params?: {
    cursor?: string
    limit?: number
  }): Promise<ReservationHistoryResponse> => {
    const res = await api.get('/shortlets/bookings/me', {
      params: {
        cursor: params?.cursor,
        limit: params?.limit ?? 8,
      },
    })
    return res.data.data
  },

  getHostBookings: async (): Promise<{ bookings: HostBookingItem[] }> => {
    const res = await api.get('/shortlets/bookings/host')
    return res.data.data
  },
}

