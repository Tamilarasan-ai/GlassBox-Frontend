/**
 * Traces API Client
 * 
 * Provides functions for fetching trace data
 */

import axiosInstance from './axiosInstance';

/**
 * Get list of traces with pagination
 * GET /api/v1/traces
 * 
 * @param {Object} params
 * @param {number} params.limit - Max items (default 50)
 * @param {number} params.offset - Skip items (default 0)
 * @param {string} params.session_id - Filter by session
 */
export async function getTraces({ limit = 50, offset = 0, session_id = null } = {}) {
    const params = { limit, offset };
    if (session_id) params.session_id = session_id;

    const response = await axiosInstance.get('/traces', { params });
    return response.data;
}

/**
 * Get trace details by ID
 * GET /api/v1/traces/{trace_id}
 */
export async function getTraceDetail(traceId) {
    const response = await axiosInstance.get(`/traces/${traceId}`);
    return response.data;
}

export async function replayTrace(traceId) {
    const response = await axiosInstance.post(`/traces/${traceId}/replay`);
    return response.data;
}

export async function getSessionTraces(sessionId) {
    const response = await axiosInstance.get(`/sessions/${sessionId}/traces`);
    return response.data;
}

export async function deleteTrace(traceId) {
    await axiosInstance.delete(`/traces/${traceId}`);
}

export default {
    getTraces,
    getTraceDetail,
};
