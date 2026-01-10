/**
 * SSE (Server-Sent Events) Streaming Service
 * 
 * Manages EventSource connections for real-time chat streaming
 */

import { getClientId } from './auth';

/**
 * Event types from backend
 */
export const EventTypes = {
    START: 'start',
    THINKING: 'thinking',
    TOOL_CALL: 'tool_call',
    TOOL_RESULT: 'tool_result',
    RESPONSE: 'response',
    COMPLETE: 'complete',
    ERROR: 'error',
};

/**
 * Create SSE connection for streaming chat
 * 
 * @param {string} message - User message
 * @param {Object} callbacks - Event callbacks
 * @param {Function} callbacks.onStart - Called when streaming starts
 * @param {Function} callbacks.onThinking - Called on thinking event
 * @param {Function} callbacks.onToolCall - Called on tool_call event
 * @param {Function} callbacks.onToolResult - Called on tool_result event
 * @param {Function} callbacks.onResponse - Called on response event
 * @param {Function} callbacks.onComplete - Called when complete
 * @param {Function} callbacks.onError - Called on error
 * @param {number} maxIterations - Max agent iterations
 * @returns {Object} - { close: Function } to close connection
 */
export function streamChat(message, callbacks = {}, maxIterations = 10, sessionId = null) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const apiKey = import.meta.env.VITE_API_KEY || 'guest-user-test-key';
    const clientId = getClientId();

    // Build request body
    const requestBody = {
        message,
        max_iterations: maxIterations,
        session_id: sessionId,
    };

    // EventSource doesn't support POST with body directly
    // We need to use fetch with ReadableStream instead
    const abortController = new AbortController();

    const startStreaming = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/v1/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${clientId}`,
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify(requestBody),
                signal: abortController.signal,
            });

            if (!response.ok) {
                const error = await response.json();
                callbacks.onError?.(error.detail || 'Request failed');
                return;
            }

            // Read stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // Decode chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Split by newlines to get individual SSE messages
                const lines = buffer.split('\n');

                // Keep incomplete line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const eventData = JSON.parse(line.substring(6));
                            handleEvent(eventData, callbacks);
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e, line);
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Streaming error:', error);
                callbacks.onError?.(error.message);
            }
        }
    };

    startStreaming();

    return {
        close: () => abortController.abort(),
    };
}

/**
 * Handle incoming SSE event
 */
function handleEvent(event, callbacks) {
    switch (event.type) {
        case EventTypes.START:
            callbacks.onStart?.(event);
            break;
        case EventTypes.THINKING:
            callbacks.onThinking?.(event);
            break;
        case EventTypes.TOOL_CALL:
            callbacks.onToolCall?.(event);
            break;
        case EventTypes.TOOL_RESULT:
            callbacks.onToolResult?.(event);
            break;
        case EventTypes.RESPONSE:
            callbacks.onResponse?.(event);
            break;
        case EventTypes.COMPLETE:
            callbacks.onComplete?.(event);
            break;
        case EventTypes.ERROR:
            callbacks.onError?.(event.message || 'Unknown error');
            break;
        default:
            console.warn('Unknown event type:', event.type, event);
    }
}

export default {
    streamChat,
    EventTypes,
};
