// Centralized Axios API Client with Interceptors
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store';
import type { ApiError } from '../types';

// Environment-based API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken;
        const tenant = useAuthStore.getState().tenant;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add tenant context for multi-tenancy
        if (tenant) {
            config.headers['X-Tenant-ID'] = tenant.id;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        // Handle 401 - Token expired
        if (error.response?.status === 401 && originalRequest) {
            const refreshToken = useAuthStore.getState().refreshToken;

            if (refreshToken) {
                try {
                    // Attempt token refresh
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;
                    useAuthStore.getState().refreshAccessToken(accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - logout user
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                }
            } else {
                useAuthStore.getState().logout();
            }
        }

        // Handle 403 - Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error.response.data);
        }

        // Handle 429 - Rate limited
        if (error.response?.status === 429) {
            console.error('Rate limited. Please try again later.');
        }

        // Handle 500+ - Server errors
        if (error.response && error.response.status >= 500) {
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default apiClient;

// Helper functions for common operations
export const setAuthHeader = (token: string) => {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
    delete apiClient.defaults.headers.common.Authorization;
};
