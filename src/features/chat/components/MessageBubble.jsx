/**
 * Message Bubble Component
 * 
 * Individual message display with premium dark theme styling
 */
import { Bot, User, AlertCircle, Terminal, Calculator, CheckCircle2 } from 'lucide-react';
import ThinkingProcess from './ThinkingProcess';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';

    if (isError) {
        return (
            <div className="flex items-start space-x-4 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-3xl shadow-glow">
                    <p className="text-sm font-medium whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
            <div className={`flex items-start space-x-4 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${isUser
                    ? 'bg-gradient-to-br from-primary-gradient_start to-primary-gradient_end'
                    : 'bg-surface border border-border-soft'
                    }`}>
                    {isUser ? (
                        <User className="w-5 h-5 text-white" />
                    ) : (
                        <Bot className="w-5 h-5 text-agent" />
                    )}
                </div>

                {/* Content Column */}
                <div className={`flex flex-col space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>

                    {/* Tool Calls & Results (Thinking Process) - NOW ABOVE CONTENT */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="w-full max-w-2xl">
                            <ThinkingProcess toolCalls={message.toolCalls} />
                        </div>
                    )}

                    {/* Message Content */}
                    <div className={`px-5 py-4 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 ${isUser
                        ? 'bg-elevated text-text-primary rounded-tr-none border border-border-soft'
                        : 'bg-surface text-text-primary rounded-tl-none border border-border-soft'
                        }`}>
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words font-normal">
                            {message.content}
                        </p>
                    </div>

                    {/* Timestamp */}
                    <div className={`text-[11px] font-medium text-text-muted opacity-0 group-hover:opacity-100 transition-opacity px-1`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );
}
