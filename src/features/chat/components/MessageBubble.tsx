import React from 'react';
import { cn, formatDateTime } from '@/lib/utils';
import type { Message } from '../types';

export interface MessageBubbleProps {
    message: Message;
    className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, className }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
        <div
            className={cn(
                'flex w-full mb-4',
                isUser ? 'justify-end' : 'justify-start',
                className
            )}
        >
            <div
                className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2',
                    isUser && 'bg-blue-600 text-white',
                    !isUser && !isSystem && 'bg-gray-100 text-gray-900',
                    isSystem && 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                )}
            >
                {/* Message content */}
                <div className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                </div>

                {/* Timestamp */}
                <div
                    className={cn(
                        'text-xs mt-1',
                        isUser ? 'text-blue-100' : 'text-gray-500'
                    )}
                >
                    {formatDateTime(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
