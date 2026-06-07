import api from "./index";
import { API_BASE_URL } from "./index";

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

    getGoogleStartUrl: (redirectPath = '/auth/oauth-callback') => {
        const params = new URLSearchParams({ redirect: redirectPath });
        return `${API_BASE_URL}/auth/google/start?${params.toString()}`;
    },

    getFacebookStartUrl: (redirectPath = '/auth/oauth-callback') => {
        const params = new URLSearchParams({ redirect: redirectPath });
        return `${API_BASE_URL}/auth/facebook/start?${params.toString()}`;
    },

    startOAuthLinkChallenge: async (linkToken: string) => {
        const response = await api.post('/auth/oauth/link/challenge/start', { linkToken });
        return response.data;
    },

    verifyOAuthLinkChallenge: async (linkToken: string, otp: string) => {
        const response = await api.post('/auth/oauth/link/challenge/verify', { linkToken, otp });
        return response.data;
    },

    startOnboardingPhoneVerification: async (phoneNumber: string) => {
        const response = await api.post('/auth/onboarding/phone/start', { phoneNumber });
        return response.data;
    },

    verifyOnboardingPhone: async (otp: string) => {
        const response = await api.post('/auth/onboarding/phone/verify', { otp });
        return response.data;
    },

    completeOnboarding: async (payload: {
        firstName?: string;
        lastName?: string;
        gender?: "male" | "female";
        dateOfBirth?: string;
    }) => {
        const response = await api.post('/auth/onboarding/complete', payload);
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