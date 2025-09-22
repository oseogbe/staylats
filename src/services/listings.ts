import api from './index'

export type DraftType = 'rental' | 'shortlet'

export interface DraftSummary {
    id: string
    title: string
    type: DraftType
    status: 'draft'
    stepsRemaining?: number
    lastUpdated: string
    image?: string
}

export default {
    saveDraft: async (payload: {
        draftId?: string
        type: DraftType
        title?: string
        step?: number
        totalSteps?: number
        formData: Record<string, any>
        images?: File[]
    }) => {
        const formData = new FormData()
        
        // Add JSON fields
        formData.append('type', payload.type)
        if (payload.title) formData.append('title', payload.title)
        if (payload.step) formData.append('step', payload.step.toString())
        if (payload.totalSteps) formData.append('totalSteps', payload.totalSteps.toString())
        formData.append('formData', JSON.stringify(payload.formData))
        
        // Add image files
        if (payload.images && payload.images.length > 0) {
            payload.images.forEach((file) => {
                formData.append('images', file)
            })
        }
        
        const res = await api.post('/listing/drafts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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

    updateDraft: async (id: string, payload: {
        type?: DraftType
        title?: string
        step?: number
        totalSteps?: number
        formData?: Record<string, any>
        photoItems?: Array<{
            url: string
            fileName?: string
            isNew: boolean
        }>
        photoFiles?: File[]
    }) => {
        const formData = new FormData()
        
        // Add JSON fields
        if (payload.type) formData.append('type', payload.type)
        if (payload.title) formData.append('title', payload.title)
        if (payload.step) formData.append('step', payload.step.toString())
        if (payload.totalSteps) formData.append('totalSteps', payload.totalSteps.toString())
        if (payload.formData) formData.append('formData', JSON.stringify(payload.formData))
        
        // Add photo items (always send, even if empty array)
        if (payload.photoItems !== undefined) {
            formData.append('photoItems', JSON.stringify(payload.photoItems))
        }
        
        // Add photo files
        if (payload.photoFiles && payload.photoFiles.length > 0) {
            payload.photoFiles.forEach((file) => {
                formData.append('images', file)
            })
        }
        
        const res = await api.patch(`/listing/drafts/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    },

    deleteDraft: async (id: string) => {
        const res = await api.delete(`/listing/drafts/${id}`)
        return res.data.data
    },

    publishListing: async (payload: {
        draftId?: string
        formData: Record<string, any>
        photoItems?: Array<{
            url: string
            fileName?: string
            isNew: boolean
        }>
        photoFiles?: File[]
    }) => {
        const formData = new FormData()
        
        // Add JSON fields
        if (payload.draftId) formData.append('draftId', payload.draftId)
        formData.append('formData', JSON.stringify(payload.formData))
        
        // Add photo items
        if (payload.photoItems && payload.photoItems.length > 0) {
            formData.append('photoItems', JSON.stringify(payload.photoItems))
        }
        
        // Add photo files
        if (payload.photoFiles && payload.photoFiles.length > 0) {
            payload.photoFiles.forEach((file) => {
                formData.append('images', file)
            })
        }
        
        const res = await api.post('/listing/publish', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    }
}


