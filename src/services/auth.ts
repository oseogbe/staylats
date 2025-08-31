import api from "./index";

export default {
    initiatePhoneAuth: async (phoneNumber: string) => {
        const response = await api.post('/auth/phone/initiate', { phoneNumber });
        return response.data;
    },

    verifyPhoneOTP: async (phoneNumber: string, otp: string) => {
        const response = await api.post('/auth/phone/verify', { phoneNumber, otp });
        return response.data;
    },

    completeRegistration: async (userData: {
        phoneNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        dateOfBirth: string;
    }) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    refreshToken: async () => {
        try {
            const response = await api.post('/auth/refresh-token');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    verifyEmail: async (token: string) => {
        const response = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        return response.data;
    },

    resendEmailVerification: async (email: string) => {
        const response = await api.post('/auth/resend-email-verification', { email });
        return response.data;
    }
};