import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, StreamChunk } from '../types';
import { API_ENDPOINTS } from '@/lib/constants';

interface UseChatStreamOptions {
    sessionId?: string;
    onMessage?: (message: Message) => void;
    onError?: (error: Error) => void;
}

export function useChatStream(options: UseChatStreamOptions = {}) {
    const { sessionId, onMessage, onError } = options;

    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isStreaming) return;

        // Add user message immediately
        const userMessage: Message = {
            id: crypto.randomUUID(),
            sessionId: sessionId || '',
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsStreaming(true);
        setStreamingContent('');

        try {
            // Create abort controller for cancellation
            abortControllerRef.current = new AbortController();

            // TODO: Replace with actual WebSocket/SSE implementation
            // This is a placeholder for the streaming logic
            const response = await fetch(API_ENDPOINTS.CHAT.STREAM, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    content,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value);
                    accumulatedContent += chunk;
                    setStreamingContent(accumulatedContent);
                }
            }

            // Create assistant message
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                sessionId: sessionId || '',
                role: 'assistant',
                content: accumulatedContent,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            onMessage?.(assistantMessage);

        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Chat stream error:', error);
                onError?.(error);
            }
        } finally {
            setIsStreaming(false);
            setStreamingContent('');
            abortControllerRef.current = null;
        }
    }, [sessionId, isStreaming, onMessage, onError]);

    const cancelStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
            setStreamingContent('');
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        messages,
        isStreaming,
        streamingContent,
        sendMessage,
        cancelStream,
        clearMessages,
    };
}
