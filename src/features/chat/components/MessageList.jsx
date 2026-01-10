/**
 * Message List Component
 * 
 * Scrollable list of chat messages with auto-scroll and streaming indicators
 */

import { useEffect, useRef } from 'react';
import { Bot, Loader2, Terminal, Calculator } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ThinkingProcess from './ThinkingProcess';

export default function MessageList({ messages, isStreaming, currentThought, thinkingSteps, startTime }) {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentThought, thinkingSteps]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <div className="w-20 h-20 rounded-2xl bg-surface border border-border-soft flex items-center justify-center shadow-glow">
                        <Calculator className="w-10 h-10 text-agent" />
                    </div>
                    <div className="space-y-2 max-w-md">
                        <h2 className="text-xl font-semibold text-text-primary">GlassBox Calculator Agent</h2>
                        <p className="text-text-secondary">
                            I can help you with mathematical calculations
                            Try asking "What is 10 + 5?"
                        </p>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}

            {/* Streaming Indicators */}
            {isStreaming && (
                <div className="flex flex-col space-y-4 animate-fade-in pl-12 max-w-3xl">
                    {/* Thinking Process Component */}
                    <ThinkingProcess
                        steps={thinkingSteps}
                        startTime={startTime}
                    />
                </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
        </div>
    );
}
