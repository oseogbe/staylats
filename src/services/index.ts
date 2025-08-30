import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL!;

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

// Track refresh token promise
let refreshTokenPromise: Promise<string> | null = null;

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                let accessToken: string;

                // If a refresh is already in progress, wait for it
                if (refreshTokenPromise) {
                    accessToken = await refreshTokenPromise;
                } else {
                    // Start new refresh token request
                    refreshTokenPromise = (async () => {
                        try {
                            const response = await api.post('/auth/refresh-token');
                            const token = response.data.data.accessToken;
                            localStorage.setItem('accessToken', token);
                            return token;
                        } finally {
                            refreshTokenPromise = null;
                        }
                    })();

                    accessToken = await refreshTokenPromise;
                }

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Only clear tokens if refresh actually failed
                localStorage.removeItem('accessToken');
                localStorage.removeItem('hadSession');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
