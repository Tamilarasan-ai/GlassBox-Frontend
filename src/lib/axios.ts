import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log('[API Request]', config.method?.toUpperCase(), config.url, config.data);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log('[API Response]', response.config.method?.toUpperCase(), response.config.url, response.data);
        }
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
            const { status, data } = error.response;

            // Log error
            console.error('[API Error]', status, error.config?.url, data);

            // Handle specific status codes
            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 404:
                    console.error('Not Found: The requested resource was not found');
                    break;
                case 500:
                    console.error('Server Error: Please try again later');
                    break;
                default:
                    console.error('API Error:', data);
            }
        } else if (error.request) {
            console.error('Network Error: No response received', error.request);
        } else {
            console.error('Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
