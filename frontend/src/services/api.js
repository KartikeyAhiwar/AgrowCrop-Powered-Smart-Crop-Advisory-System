import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Custom hook to use authenticated API
 * Automatically attaches the Bearer token to requests
 */
export const useApi = () => {
    const { token } = useAuth();

    useEffect(() => {
        // Request interceptor to add token
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for logging/errors
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response ? error.response.status : null;
                if (status === 401) {
                    console.warn('Unauthorized access - token may be invalid or expired');
                    // Could trigger logout here if needed
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors when token changes or component unmounts
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    return api;
};

// Export raw axios instance for non-hook usage (careful with auth)
export const apiUnauth = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
