import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await api.post('/auth/refresh-token');
                const { accessToken } = response.data.data;

                // Update stored token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
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

    validateToken: async () => {
        try {
            const response = await api.get('/auth/validate');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        return response.data;
    }
};

export default api;
