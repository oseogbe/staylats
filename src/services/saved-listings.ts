import api from './index'

import type { ActiveListing } from './listings'

/** A saved listing carries the public listing payload plus when it was saved. */
export interface SavedListing extends ActiveListing {
    savedAt: string
}

const savedListingsService = {
    getSavedListings: async (): Promise<{ listings: SavedListing[] }> => {
        const res = await api.get('/listing/saved')
        return res.data.data
    },

    /** Ids only — enough to render the saved state on listing cards. */
    getSavedListingIds: async (): Promise<{ listingIds: string[] }> => {
        const res = await api.get('/listing/saved/ids')
        return res.data.data
    },

    saveListing: async (listingId: string) => {
        const res = await api.post(`/listing/${listingId}/save`)
        return res.data.data
    },

    unsaveListing: async (listingId: string) => {
        const res = await api.delete(`/listing/${listingId}/save`)
        return res.data.data
    }
}

export default savedListingsService
