import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChatStream } from '../hooks/useChatStream';

export interface ChatContainerProps {
    sessionId?: string;
    className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ sessionId, className }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {
        messages,
        isStreaming,
        streamingContent,
        sendMessage,
        clearMessages,
    } = useChatStream({ sessionId });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    return (
        <div className={cn('flex flex-col h-full bg-white', className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
                <button
                    onClick={clearMessages}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && !isStreaming && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                )}

                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {/* Streaming message */}
                {isStreaming && streamingContent && (
                    <MessageBubble
                        message={{
                            id: 'streaming',
                            sessionId: sessionId || '',
                            role: 'assistant',
                            content: streamingContent,
                            timestamp: new Date(),
                        }}
                    />
                )}

                {/* Typing indicator */}
                {isStreaming && !streamingContent && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
    );
};

export default ChatContainer;
