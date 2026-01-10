import { useState } from 'react';
import { Bot, User, PanelLeftOpen, Upload, X, ArrowRight, Loader2 } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useStreamChat } from '../hooks/useStreamChat';
import { getClientId } from '../../../services/api/auth';

export default function ChatContainer({ isSidebarOpen, toggleSidebar }) {
    const {
        messages,
        isStreaming,
        currentThought,
        thinkingSteps,
        startTime,
        sendMessage,
        loadSession,
        sessionId
    } = useStreamChat();

    const [showResumeInput, setShowResumeInput] = useState(false);
    const [resumeId, setResumeId] = useState('');
    const [isResuming, setIsResuming] = useState(false);
    const clientId = getClientId();

    const handleResume = async (e) => {
        e.preventDefault();
        if (!resumeId.trim()) return;

        setIsResuming(true);
        const success = await loadSession(resumeId.trim());
        setIsResuming(false);

        if (success) {
            setShowResumeInput(false);
            setResumeId('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg text-text-primary relative font-sans">
            {/* Header */}
            <header className="h-16 border-b border-border-soft flex items-center justify-between px-6 bg-bg/80 backdrop-blur-md z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    {!isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-surface rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <PanelLeftOpen className="w-5 h-5" />
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border-soft flex items-center justify-center shadow-sm">
                        <Bot className="w-6 h-6 text-agent" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary leading-tight">Calculator Agent</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-text-secondary font-medium">Capable of complex arithmetic using Python tools.</p>
                            {sessionId && (
                                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                    {sessionId.slice(0, 8)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Resume Session Button/Input */}
                    <div className="relative">
                        {showResumeInput ? (
                            <form onSubmit={handleResume} className="flex items-center gap-2 bg-surface border border-border-soft rounded-lg p-1 animate-in fade-in slide-in-from-right-4 duration-200">
                                <input
                                    type="text"
                                    value={resumeId}
                                    onChange={(e) => setResumeId(e.target.value)}
                                    placeholder="Paste Session ID..."
                                    className="bg-transparent border-none text-xs text-text-primary placeholder-text-disabled focus:ring-0 w-48 px-2"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isResuming}
                                    className="p-1.5 bg-agent/10 text-agent hover:bg-agent/20 rounded-md transition-colors disabled:opacity-50"
                                >
                                    {isResuming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowResumeInput(false)}
                                    className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowResumeInput(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface hover:bg-white/5 border border-border-soft text-xs font-medium text-text-secondary hover:text-text-primary transition-all"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Resume Session
                            </button>
                        )}
                    </div>

                    <div className="h-6 w-px bg-border-soft mx-1" />

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-soft" title={`Guest ID: ${clientId}`}>
                        <User className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-xs font-mono text-text-secondary">
                            {clientId.slice(0, 8)}...
                        </span>
                    </div>
                </div>
            </header>
            {/* Messages */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                <MessageList messages={messages} isStreaming={isStreaming} currentThought={currentThought} thinkingSteps={thinkingSteps} startTime={startTime} />
            </div>
            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
    );
}
