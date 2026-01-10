import { useState } from 'react';
import {
    Brain,
    Terminal,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    MessageSquare
} from 'lucide-react';

export default function TraceStepItem({ step, totalDuration }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate width percentage relative to total trace duration
    const durationPercent = totalDuration > 0
        ? Math.min(100, Math.max(1, (step.latency_ms / totalDuration) * 100))
        : 0;

    const getStepIcon = () => {
        switch (step.step_type) {
            case 'thought': return <Brain className="w-4 h-4 text-purple-400" />;
            case 'tool_call': return <Terminal className="w-4 h-4 text-blue-400" />;
            case 'tool_result': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'llm_call': return <MessageSquare className="w-4 h-4 text-orange-400" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStepColor = () => {
        if (step.is_error) return 'border-red-500/30 bg-red-500/5';
        switch (step.step_type) {
            case 'thought': return 'border-purple-500/20 bg-purple-500/5';
            case 'tool_call': return 'border-blue-500/20 bg-blue-500/5';
            case 'tool_result': return 'border-green-500/20 bg-green-500/5';
            default: return 'border-border-soft bg-surface/50';
        }
    };

    return (
        <div className={`border rounded-lg overflow-hidden transition-all ${getStepColor()}`}>
            {/* Header */}
            <div
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-shrink-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                </div>

                <div className="flex-shrink-0 p-1.5 rounded-md bg-bg/50 border border-white/5">
                    {getStepIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-text-primary truncate">
                            {step.step_name || step.step_type}
                        </span>
                        <span className="text-xs font-mono text-text-muted flex-shrink-0">
                            {step.latency_ms}ms
                        </span>
                    </div>

                    {/* Duration Bar */}
                    <div className="mt-1.5 h-1 w-full bg-bg/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-current opacity-50 rounded-full"
                            style={{ width: `${durationPercent}%`, color: 'inherit' }}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-white/5 p-3 space-y-3 bg-bg/30">
                    {step.input_payload && (
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Input</div>
                            <pre className="text-xs font-mono bg-black/30 p-2 rounded border border-white/5 overflow-x-auto text-text-primary">
                                {JSON.stringify(step.input_payload, null, 2)}
                            </pre>
                        </div>
                    )}

                    {step.output_payload && (
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Output</div>
                            <pre className="text-xs font-mono bg-black/30 p-2 rounded border border-white/5 overflow-x-auto text-text-primary">
                                {JSON.stringify(step.output_payload, null, 2)}
                            </pre>
                        </div>
                    )}

                    {step.is_error && step.error_message && (
                        <div className="flex items-start gap-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="font-mono break-all">{step.error_message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
