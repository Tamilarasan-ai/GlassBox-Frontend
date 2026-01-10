/**
/**
 * Chat Input Component
 * 
 * Premium input area with floating gradient send button
 */

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-6 bg-bg border-t border-border-soft">
            <form
                onSubmit={handleSubmit}
                className={`relative flex items-end gap-2 bg-elevated rounded-2xl border transition-all duration-200 ${isFocused
                    ? 'border-primary/50 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]'
                    : 'border-border-soft hover:border-border-divider'
                    }`}
            >
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask the agent to calculate something..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent text-text-primary placeholder-text-muted px-4 py-4 min-h-[56px] max-h-[200px] resize-none focus:outline-none text-[15px] leading-relaxed disabled:opacity-50"
                    style={{ height: 'auto', minHeight: '56px' }}
                />

                <div className="p-2 pb-2.5">
                    <button
                        type="submit"
                        disabled={disabled || !input.trim()}
                        className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${input.trim() && !disabled
                            ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
                            : 'bg-surface text-text-disabled cursor-not-allowed'
                            }`}
                    >
                        {disabled ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
            <div className="text-center mt-3">
                <p className="text-[11px] text-text-muted font-medium flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    AI outputs are generated in real-time. Check traces for debugging.
                </p>
            </div>
        </div>
    );
}
