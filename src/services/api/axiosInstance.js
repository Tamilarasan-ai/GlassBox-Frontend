/**
 * Axios Instance Configuration
 * 
 * Configures axios with authentication headers, base URL, and interceptors
 */

import axios from 'axios';
import { getClientId, generateDeviceFingerprint } from './auth';
import env from '../../config/env';

// Get API configuration from environment
// Get API configuration from environment
let API_BASE_URL = env.API_BASE_URL || 'http://localhost:8000';

// Ensure /api/v1 suffix for axios instance
if (!API_BASE_URL.endsWith('/api/v1')) {
    API_BASE_URL += '/api/v1';
}

const API_KEY = import.meta.env.VITE_API_KEY || 'guest-user-test-key';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authentication headers
axiosInstance.interceptors.request.use(
    async (config) => {
        // Add API Key header
        config.headers['X-API-Key'] = API_KEY;

        // Add Bearer token (client UUID)
        const clientId = getClientId();
        config.headers['Authorization'] = `Bearer ${clientId}`;

        // Optionally add device fingerprint (uncomment if needed)
        // const fingerprint = await generateDeviceFingerprint();
        // if (fingerprint) {
        //   config.headers['X-Device-Fingerprint'] = fingerprint;
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    console.error('Authentication failed:', error.response.data);
                    break;
                case 403:
                    console.error('Access forbidden:', error.response.data);
                    break;
                case 429:
                    console.error('Rate limit exceeded:', error.response.data);
                    // You could emit an event or update global state here
                    break;
                case 500:
                    console.error('Server error:', error.response.data);
                    break;
                default:
                    console.error('API error:', error.response.data);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
