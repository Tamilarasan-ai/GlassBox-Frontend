/**
 * Chat API Client
 * 
 * Provides functions for chat-related API calls
 */

import axiosInstance from './axiosInstance';

/**
 * Send a chat message (non-streaming, deprecated)
 * POST /api/v1/chat
 */
export async function sendChatMessage(message, maxIterations = 10) {
    const response = await axiosInstance.post('/chat', {
        message,
        max_iterations: maxIterations,
    });
    return response.data;
}

/**
 * Get streaming endpoint URL
 * This is used by EventSource for SSE streaming
 */
export function getStreamingUrl() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}/api/v1/chat/stream`;
}

export default {
    sendChatMessage,
    getStreamingUrl,
};
