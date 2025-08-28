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
                const { accessToken } = response.data;

                // Update stored token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
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
