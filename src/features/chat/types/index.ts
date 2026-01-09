// Chat-related TypeScript types

export interface Message {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface ChatSession {
    id: string;
    userId?: string;
    title?: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
    metadata?: Record<string, any>;
}

export interface StreamChunk {
    type: 'start' | 'content' | 'end' | 'error';
    content?: string;
    messageId?: string;
    error?: string;
}

export interface SendMessagePayload {
    sessionId?: string;
    content: string;
    metadata?: Record<string, any>;
}

export interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    isLoading: boolean;
    isStreaming: boolean;
    error: string | null;
}
