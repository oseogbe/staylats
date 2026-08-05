import api from './index'

import type { PhotoItemPayload } from '@/hooks/use-photo-upload'

export type DraftType = 'rental' | 'shortlet'

/** Files and photo metadata shared by the draft and publish endpoints. */
export interface ListingMediaPayload {
    /**
     * The full photo list in display order. New photos carry a `fileName` the
     * API uses to swap their local preview URL for the uploaded S3 URL.
     */
    photoItems?: PhotoItemPayload[]
    photoFiles?: File[]
    tenancyAgreementFile?: File
    proofOfVisitFile?: File
    utilityBillFile?: File
}

/**
 * Appends the photo list and every document to a multipart body, using the
 * field names the listing routes expect.
 */
const appendListingMedia = (formData: FormData, payload: ListingMediaPayload) => {
    // Always send photoItems when provided, even if empty - an empty array means
    // "the host removed every photo", which is different from "not supplied".
    if (payload.photoItems !== undefined) {
        formData.append('photoItems', JSON.stringify(payload.photoItems))
    }

    payload.photoFiles?.forEach((file) => {
        formData.append('images', file)
    })

    const documents: Array<[string, File | undefined]> = [
        ['tenancyAgreement', payload.tenancyAgreementFile],
        ['proofOfVisitFile', payload.proofOfVisitFile],
        ['utilityBillFile', payload.utilityBillFile]
    ]

    documents.forEach(([field, file]) => {
        if (file) formData.append(field, file)
    })

    return formData
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export interface DraftSummary {
    id: string
    title: string
    type: DraftType
    status: 'draft'
    stepsRemaining?: number
    lastUpdated: string
    images?: string[]
}

export interface UserListing {
    id: string
    title: string
    type: DraftType
    description: string
    address: string
    city: string
    state: string
    propertyType: string
    images: string[]
    amenities: string[]
    status: "draft" | "pending" | "active" | "declined"
    createdAt: string
    updatedAt: string
}

export interface ActiveListing {
    id: string
    slug: string
    type: DraftType
    title: string
    description: string
    city: string
    state: string
    propertyType: string
    images: string[]
    amenities: string[]
    bedrooms: number
    bathrooms: number
    maxOccupants: { adults: number; kids: number; infants: number; pets: boolean }
    shortletInfo?: { pricePerNight: number; cleaningFee?: number; securityDeposit?: number } | null
    rentalInfo?: { pricing: Record<string, number>; inspectionFee?: number; serviceCharge?: number; securityDeposit?: number } | null
    createdAt: string
}

export interface ListingDetail {
    id: string
    slug: string
    type: DraftType
    title: string
    description: string | null
    city: string
    state: string
    location: { lat: number; lng: number }
    propertyType: string
    images: string[]
    amenities: string[]
    bedrooms: number
    bathrooms: number
    maxOccupants: { adults: number; kids: number; infants: number; pets: boolean }
    shortletInfo?: {
        houseRules?: string | null
        pricePerNight: number
        cleaningFee?: number | null
        securityDeposit?: number | null
        minStayNights?: number | null
        maxStayNights?: number | null
        checkInTime?: string | null
        checkOutTime?: string | null
        availableFrom?: string | null
        availableUntil?: string | null
        frontDeskContact?: string | null
        isInstantBookable?: boolean | null
    } | null
    rentalInfo?: {
        tenancyAgreement?: string | null
        contractTerms?: string[]
        inspectionFee?: number | null
        pricing: Record<string, number>
        serviceCharge?: number | null
        cautionFee?: number | null
        securityDeposit?: number | null
        paymentFrequency?: string | null
        availableFromDate?: string | null
        requiredDocuments?: string[]
        agentPercentage?: number | null
    } | null
    status: string
    createdAt: string
    user: {
        firstName: string | null
        lastName: string | null
        image: string | null
        createdAt: string
    }
}

/** Query filters accepted by the public active-listings endpoint */
export interface ActiveListingFilters {
    limit?: number
    type?: DraftType
    city?: string
    /** ISO string — only applied together with checkOutDate */
    checkInDate?: string
    /** ISO string — only applied together with checkInDate */
    checkOutDate?: string
    /** Adults + children; matched against a listing's max occupants */
    guests?: number
}

export interface HostListingDashboardMetric {
    listingId: string
    bookings: number
    currentEarnings: number
}

export interface HostDashboardMetrics {
    totalEarnings: number
    earningShortlets: number
    earningRentals: number
    totalBookings: number
    bookedShortlets: number
    bookedRentals: number
    topPerformingListing: string | null
    listingMetrics: HostListingDashboardMetric[]
}

export default {
    /**
     * Public endpoint — fetches a single listing by slug (no auth needed).
     */
    getListingBySlug: async (slug: string): Promise<{ listing: ListingDetail }> => {
        const res = await api.get(`/listing/slug/${slug}`)
        return res.data.data
    },

    /**
     * Public endpoint — fetches active listings (no auth needed).
     *
     * `checkInDate`/`checkOutDate` must be sent as a pair; the server uses them
     * to drop shortlets that are already reserved for any part of the range.
     */
    getActiveListings: async (
        filters: ActiveListingFilters = {}
    ): Promise<{ listings: ActiveListing[] }> => {
        const { limit, type, city, checkInDate, checkOutDate, guests } = filters
        const params: Record<string, string> = {}
        if (limit) params.limit = limit.toString()
        if (type) params.type = type
        if (city) params.city = city
        if (guests) params.guests = guests.toString()
        if (checkInDate && checkOutDate) {
            params.checkInDate = checkInDate
            params.checkOutDate = checkOutDate
        }
        const res = await api.get('/listing/active', { params })
        return res.data.data
    },

    getUserListings: async (): Promise<{ listings: UserListing[] }> => {
        const res = await api.get('/listing/published')
        return res.data.data
    },

    getHostDashboardMetrics: async (period: string): Promise<HostDashboardMetrics> => {
        const res = await api.get('/listing/host/dashboard-metrics', { params: { period } })
        return res.data.data
    },

    saveDraft: async (payload: ListingMediaPayload & {
        draftId?: string
        type: DraftType
        title?: string
        step?: number
        totalSteps?: number
        formData: Record<string, any>
        /** Alias for `photoFiles`, kept for the create-draft call sites. */
        images?: File[]
    }) => {
        const formData = new FormData()

        // Add JSON fields
        formData.append('type', payload.type)
        if (payload.title) formData.append('title', payload.title)
        if (payload.step) formData.append('step', payload.step.toString())
        if (payload.totalSteps) formData.append('totalSteps', payload.totalSteps.toString())
        formData.append('formData', JSON.stringify(payload.formData))

        appendListingMedia(formData, {
            ...payload,
            photoFiles: payload.photoFiles ?? payload.images
        })

        const res = await api.post('/listing/drafts', formData, multipart)
        return res.data
    },

    getDrafts: async (): Promise<{ drafts: DraftSummary[] }> => {
        const res = await api.get('/listing/drafts')
        return res.data.data
    },

    getDraftById: async (id: string) => {
        const res = await api.get(`/listing/drafts/${id}`)
        return res.data.data
    },

    updateDraft: async (id: string, payload: ListingMediaPayload & {
        type?: DraftType
        title?: string
        step?: number
        totalSteps?: number
        formData?: Record<string, any>
    }) => {
        const formData = new FormData()

        // Add JSON fields
        if (payload.type) formData.append('type', payload.type)
        if (payload.title) formData.append('title', payload.title)
        if (payload.step) formData.append('step', payload.step.toString())
        if (payload.totalSteps) formData.append('totalSteps', payload.totalSteps.toString())
        if (payload.formData) formData.append('formData', JSON.stringify(payload.formData))

        appendListingMedia(formData, payload)

        const res = await api.patch(`/listing/drafts/${id}`, formData, multipart)
        return res.data
    },

    deleteDraft: async (id: string) => {
        const res = await api.delete(`/listing/drafts/${id}`)
        return res.data.data
    },

    publishListing: async (payload: ListingMediaPayload & {
        draftId?: string
        formData: Record<string, any>
    }) => {
        const formData = new FormData()

        // Add JSON fields
        if (payload.draftId) formData.append('draftId', payload.draftId)
        formData.append('formData', JSON.stringify(payload.formData))

        appendListingMedia(formData, payload)

        const res = await api.post('/listing/publish', formData, multipart)
        return res.data
    }
}


