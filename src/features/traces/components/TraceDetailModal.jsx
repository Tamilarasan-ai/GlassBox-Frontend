import { useEffect, useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    DollarSign,
    Zap,
    Copy,
    Play,
    CheckCircle2,
    XCircle,
    Loader2,
    ChevronDown,
    History
} from 'lucide-react';
import { getTraceDetail, replayTrace, getSessionTraces } from '../../../services/api/tracesApi';
import TraceStepItem from './TraceStepItem';
import { useToast } from '@/components/ui/Toast';

export default function TraceDetailModal({ traceId, onClose }) {
    const [currentTraceId, setCurrentTraceId] = useState(traceId);
    const [trace, setTrace] = useState(null);
    const [sessionTraces, setSessionTraces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayMessage, setReplayMessage] = useState(null);
    const [showVersionDropdown, setShowVersionDropdown] = useState(false);
    const { toast } = useToast();

    // Fetch trace details when currentTraceId changes
    useEffect(() => {
        if (!currentTraceId) return;

        const fetchTrace = async () => {
            try {
                setLoading(true);
                const data = await getTraceDetail(currentTraceId);
                setTrace(data);

                // Once we have the trace, fetch all traces for this session to build version history
                if (data.session_id) {
                    const sessionData = await getSessionTraces(data.session_id);
                    // Sort by created_at ascending to determine version numbers
                    const sorted = sessionData.traces.sort((a, b) =>
                        new Date(a.created_at) - new Date(b.created_at)
                    );
                    setSessionTraces(sorted);
                }
            } catch (err) {
                console.error('Failed to fetch trace details:', err);
                setError('Failed to load trace details');
            } finally {
                setLoading(false);
            }
        };

        fetchTrace();
    }, [currentTraceId]);

    const handleReplay = async () => {
        if (!trace) return;

        try {
            setIsReplaying(true);
            setReplayMessage(null);
            const result = await replayTrace(trace.id);

            setReplayMessage({ type: 'success', text: 'Replay successful! Switching to new version...' });

            // Refresh session traces and switch to new trace
            const sessionData = await getSessionTraces(trace.session_id);
            const sorted = sessionData.traces.sort((a, b) =>
                new Date(a.created_at) - new Date(b.created_at)
            );
            setSessionTraces(sorted);

            // Switch to the new trace (the one we just created)
            // The API returns the new_trace_id
            setCurrentTraceId(result.new_trace_id);

            setTimeout(() => setReplayMessage(null), 3000);
        } catch (err) {
            console.error('Replay failed:', err);
            setReplayMessage({ type: 'error', text: 'Failed to replay trace. Please try again.' });
        } finally {
            setIsReplaying(false);
        }
    };

    const getCurrentVersionNumber = () => {
        const index = sessionTraces.findIndex(t => t.id === currentTraceId);
        return index !== -1 ? index + 1 : '?';
    };

    if (!traceId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div
                className="bg-[#0A0A0A] w-full max-w-6xl h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Trace Details</h2>

                        {/* Version Dropdown */}
                        {sessionTraces.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-mono text-blue-300"
                                >
                                    <History className="w-3.5 h-3.5" />
                                    <span>v{getCurrentVersionNumber()}</span>
                                    <span className="text-gray-500 text-xs">of {sessionTraces.length}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                </button>

                                {showVersionDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowVersionDropdown(false)}
                                        />
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                            {sessionTraces.map((t, index) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => {
                                                        setCurrentTraceId(t.id);
                                                        setShowVersionDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${t.id === currentTraceId ? 'bg-blue-500/10' : ''
                                                        }`}
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className={`text-sm font-mono ${t.id === currentTraceId ? 'text-blue-400 font-bold' : 'text-gray-300'}`}>
                                                            v{index + 1}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">
                                                            {new Date(t.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${t.is_successful
                                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                        {t.is_successful ? 'OK' : 'ERR'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                            {currentTraceId?.slice(0, 8)}...
                        </div>

                        {trace && (
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${trace.is_successful
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {trace.is_successful ? 'Completed' : 'Failed'}
                            </div>
                        )}
                    </div>

                    {trace && (
                        <div className="flex items-center gap-6 mr-8">
                            <MetricItem label="LATENCY" value={`${(trace.latency_ms / 1000).toFixed(2)}s`} />
                            <MetricItem label="TOKENS" value={trace.total_tokens} />
                            <MetricItem label="COST" value={`$${Number(trace.total_cost).toFixed(6)}`} />
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center text-red-400">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Column: Execution Flow */}
                        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
                            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-gray-200">Execution Flow</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-400">
                                        {trace.steps.length} Steps
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {/* User Input */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        User Input
                                    </div>
                                    <p className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                        {trace.user_input}
                                    </p>
                                </div>

                                {/* Steps Waterfall */}
                                <div className="space-y-3 relative pl-4 border-l border-white/10 ml-4 py-2">
                                    {trace.steps.map((step) => (
                                        <TraceStepItem
                                            key={step.id}
                                            step={step}
                                            totalDuration={trace.latency_ms}
                                        />
                                    ))}
                                </div>

                                {/* Final Output */}
                                {trace.final_output && (
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            Final Output
                                        </div>
                                        <p className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                            {trace.final_output}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Metadata Sidebar */}
                        <div className="w-[350px] bg-[#0F0F0F] flex flex-col overflow-y-auto border-l border-white/10">
                            <div className="px-6 py-4 border-b border-white/10">
                                <h3 className="text-sm font-semibold text-gray-200">Run Metadata</h3>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Session ID */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Session ID</label>
                                    <div className="flex items-center gap-2 p-3 rounded bg-white/5 border border-white/10 group">
                                        <code className="text-xs text-blue-300 font-mono flex-1 truncate">
                                            {trace.session_id}
                                        </code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(trace.session_id);
                                                toast({
                                                    title: "Copied",
                                                    description: "Session ID copied to clipboard",
                                                    variant: "success",
                                                    duration: 2000
                                                });
                                            }}
                                            className="text-gray-500 hover:text-white transition-colors"
                                            title="Copy Session ID"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Model Config */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Model Configuration</label>
                                    <div className="p-3 rounded bg-white/5 border border-white/10 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Model</span>
                                            <span className="text-white font-mono">
                                                {trace.model_config_snapshot?.model || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Temp</span>
                                            <span className="text-white font-mono">
                                                {trace.model_config_snapshot?.temperature ?? 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* System Prompt */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Prompt Snapshot</label>
                                    <div className="p-3 rounded bg-white/5 border border-white/10">
                                        <p className="text-xs text-gray-400 line-clamp-6 leading-relaxed font-mono">
                                            {trace.system_prompt_snapshot || "No system prompt recorded."}
                                        </p>
                                    </div>
                                </div>

                                {/* Replay Button */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleReplay}
                                        disabled={isReplaying}
                                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all group ${isReplaying
                                            ? 'bg-white/5 text-gray-400 cursor-not-allowed'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                                            }`}
                                    >
                                        {isReplaying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Replaying...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 fill-current opacity-50 group-hover:opacity-100" />
                                                Replay Trace
                                            </>
                                        )}
                                    </button>

                                    {replayMessage && (
                                        <div className={`text-xs p-3 rounded border ${replayMessage.type === 'success'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {replayMessage.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricItem({ label, value }) {
    return (
        <div className="text-center">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
            <div className="text-sm font-bold text-white font-mono">{value}</div>
        </div>
    );
}
