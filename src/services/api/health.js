/**
 * Health API Client
 * 
 * Provides functions to check backend health and connectivity
 */

import axiosInstance from './axiosInstance';
import env from '../../config/env';

const ROOT_URL = env.API_BASE_URL || 'http://localhost:8000';

/**
 * Basic health check (no auth required)
 * GET /
 */
export async function getBasicHealth() {
    const response = await axiosInstance.get('/', {
        baseURL: ROOT_URL, // Override to root
        // Skip auth headers for basic health check
        transformRequest: [(data, headers) => {
            delete headers['Authorization'];
            delete headers['X-API-Key'];
            return data;
        }],
    });
    return response.data;
}

/**
 * Detailed health check with database connectivity
 * GET /health
 */
export async function getDetailedHealth() {
    const response = await axiosInstance.get('/health', {
        baseURL: ROOT_URL, // Override to root
        // Skip auth headers for health check
        transformRequest: [(data, headers) => {
            delete headers['Authorization'];
            delete headers['X-API-Key'];
            return data;
        }],
    });
    return response.data;
}

export default {
    getBasicHealth,
    getDetailedHealth,
};
