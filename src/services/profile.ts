import api from "./index";

export default {
    getCurrentUser: async () => {
        const response = await api.get('/profile/basic-info');
        return response.data;
    },

    updateBasicInfo: async (data: {
        firstName: string;
        lastName: string;
        dateOfBirth: string; // ISO date string YYYY-MM-DD
        gender: string;
    }) => {
        const response = await api.put('/profile/basic-info', data);
        return response.data;
    },
    
    changeProfilePicture: async (formData: FormData) => {
        const response = await api.post('/profile/change-profile-pic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    submitHostVerification: async (formData: FormData) => {
        const response = await api.post('/profile/host-verification', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};