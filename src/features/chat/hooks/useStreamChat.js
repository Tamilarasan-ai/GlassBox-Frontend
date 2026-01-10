/**
 * useStreamChat Hook
 * 
 * React hook for managing SSE streaming chat
 */

import { useState, useRef, useCallback } from 'react';
import { streamChat } from '../../../services/api/streaming';
import { getSessionTraces } from '../../../services/api/tracesApi';

export function useStreamChat() {
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentThought, setCurrentThought] = useState('');
    const [thinkingSteps, setThinkingSteps] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const streamRef = useRef(null);

    const loadSession = useCallback(async (id) => {
        try {
            setError(null);
            setMessages([]);
            const data = await getSessionTraces(id);

            // Reconstruct messages from traces
            // Sort by created_at ascending
            const sortedTraces = data.traces.sort((a, b) =>
                new Date(a.created_at) - new Date(b.created_at)
            );

            const reconstructedMessages = [];
            sortedTraces.forEach(trace => {
                // User Message
                reconstructedMessages.push({
                    id: `${trace.id}_user`,
                    role: 'user',
                    content: trace.user_input,
                    timestamp: trace.created_at,
                });

                // Assistant Message (if completed)
                if (trace.final_output) {
                    // Reconstruct toolCalls from steps
                    const toolCalls = [];
                    if (trace.steps) {
                        trace.steps.forEach(step => {
                            if (step.step_type === 'tool') {
                                // Add call
                                toolCalls.push({
                                    type: 'call',
                                    name: step.step_name,
                                    args: step.input_payload
                                });
                                // Add result
                                toolCalls.push({
                                    type: 'result',
                                    name: step.step_name,
                                    result: JSON.stringify(step.output_payload, null, 2)
                                });
                            }
                        });
                    }

                    reconstructedMessages.push({
                        id: `${trace.id}_assistant`,
                        role: 'assistant',
                        content: trace.final_output,
                        timestamp: trace.completed_at || trace.created_at,
                        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                    });
                }
            });

            setMessages(reconstructedMessages);
            setSessionId(id);
            return true;
        } catch (err) {
            console.error('Failed to load session:', err);
            setError('Failed to load session. Please check the ID.');
            return false;
        }
    }, []);

    const sendMessage = useCallback((userMessage) => {
        // Clear previous error
        setError(null);

        // Add user message immediately
        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Start streaming
        setIsStreaming(true);
        setCurrentThought('');
        setThinkingSteps([]); // Reset steps
        setStartTime(Date.now());

        // Prepare assistant message placeholder
        const assistantMsgId = Date.now() + 1;
        let assistantContent = '';
        let toolCalls = [];

        const callbacks = {
            onStart: (event) => {
                console.log('Stream started:', event);
                if (event.session_id) {
                    setSessionId(event.session_id);
                }
            },

            onThinking: (event) => {
                setCurrentThought(event.content || 'Processing...');
            },

            onToolCall: (event) => {
                console.log('Tool call:', event);

                // Add new running step
                setThinkingSteps(prev => [...prev, {
                    id: event.id || Date.now(), // Use event ID if available
                    type: 'tool',
                    name: event.name,
                    status: 'running',
                    args: event.args
                }]);

                toolCalls.push({
                    type: 'call',
                    name: event.name,
                    args: event.args,
                });
            },

            onToolResult: (event) => {
                console.log('Tool result:', event);

                // Update last running step to completed
                setThinkingSteps(prev => {
                    const newSteps = [...prev];
                    // Find the last running step with matching name
                    const stepIndex = newSteps.map(s => s.name).lastIndexOf(event.name);
                    if (stepIndex !== -1) {
                        newSteps[stepIndex] = {
                            ...newSteps[stepIndex],
                            status: 'completed',
                            result: event.result
                        };
                    }
                    return newSteps;
                });

                toolCalls.push({
                    type: 'result',
                    name: event.name,
                    result: event.result,
                });
            },

            onResponse: (event) => {
                assistantContent = event.content;
                setCurrentThought('');
            },

            onComplete: (event) => {
                console.log('Stream complete:', event);

                // Add final assistant message
                const assistantMsg = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: assistantContent || event.response || 'No response',
                    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, assistantMsg]);
                setIsStreaming(false);
                setCurrentThought('');
                setThinkingSteps([]);
                setStartTime(null);
            },

            onError: (errorMsg) => {
                console.error('Stream error:', errorMsg);
                setError(errorMsg);
                setIsStreaming(false);
                setCurrentThought('');
                setThinkingSteps([]);
                setStartTime(null);

                // Add error message
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'error',
                    content: errorMsg,
                    timestamp: new Date().toISOString(),
                }]);
            },
        };

        // Start stream with current sessionId
        streamRef.current = streamChat(userMessage, callbacks, 10, sessionId);
    }, [sessionId]); // Re-create sendMessage when sessionId changes

    const stopStreaming = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.close();
            streamRef.current = null;
        }
        setIsStreaming(false);
        setCurrentThought('');
        setThinkingSteps([]);
        setStartTime(null);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
        setSessionId(null); // Clear session ID too
    }, []);

    return {
        messages,
        isStreaming,
        currentThought,
        thinkingSteps,
        startTime,
        error,
        sessionId,
        sendMessage,
        stopStreaming,
        clearMessages,
        loadSession,
    };
}
