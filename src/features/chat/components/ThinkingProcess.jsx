import { useState, useEffect } from 'react';
import { Brain, ChevronDown, ChevronUp, Wrench, Clock, CheckCircle2, Circle, Terminal } from 'lucide-react';

export default function ThinkingProcess({ steps, startTime, toolCalls }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [duration, setDuration] = useState(0);

    // Timer effect
    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            setDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    // Determine if we have content to show
    const hasContent = (steps && steps.length > 0) || (toolCalls && toolCalls.length > 0);

    if (!hasContent) {
        // Show simple thinking state if no steps yet
        return (
            <div className="flex items-center gap-3 p-4 bg-surface/50 border border-border-soft rounded-2xl animate-pulse">
                <Brain className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-secondary font-medium">Thinking...</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-panel border border-border-soft rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            {/* Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between px-4 py-3 bg-surface/50 cursor-pointer hover:bg-surface transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <Brain className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-secondary">
                        {startTime ? `Thought for ${duration} seconds` : 'Thinking Process'}
                    </span>
                </div>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Content Body */}
            {isExpanded && (
                <div className="px-4 py-2 space-y-1 bg-bg/30">
                    {/* Mode 1: Streaming Steps (Progress Tracker) */}
                    {steps && steps.map((step, index) => (
                        <div key={index} className="flex items-center justify-between py-2 group">
                            {/* Left: Tool Name */}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <Wrench className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                                <span className="text-sm font-medium text-text-secondary truncate font-mono">
                                    {step.name}
                                </span>
                            </div>

                            {/* Right: Status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {step.status === 'running' && (
                                    <>
                                        <Clock className="w-3.5 h-3.5 text-text-secondary animate-spin-slow" />
                                        <span className="text-xs font-medium text-text-secondary">Running</span>
                                    </>
                                )}
                                {step.status === 'completed' && (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                        <span className="text-xs font-medium text-text-primary">Completed</span>
                                    </>
                                )}
                                {step.status === 'pending' && (
                                    <>
                                        <Circle className="w-3.5 h-3.5 text-text-disabled" />
                                        <span className="text-xs font-medium text-text-disabled">Pending</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pending Step Placeholder for Streaming */}
                    {steps && steps.length > 0 && steps[steps.length - 1].status === 'completed' && (
                        <div className="flex items-center justify-between py-2 opacity-50">
                            <div className="flex items-center gap-2.5">
                                <Wrench className="w-3.5 h-3.5 text-text-disabled" />
                                <span className="text-sm font-medium text-text-disabled font-mono">next-step...</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Circle className="w-3.5 h-3.5 text-text-disabled" />
                                <span className="text-xs font-medium text-text-disabled">Pending</span>
                            </div>
                        </div>
                    )}

                    {/* Mode 2: Static Tool Calls (Detailed Log) */}
                    {toolCalls && toolCalls.map((tool, idx) => (
                        <div key={idx} className="py-2 space-y-2">
                            {tool.type === 'call' ? (
                                <div className="flex flex-col gap-1.5 bg-surface/50 rounded-lg p-3 border border-border-soft/50">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Terminal className="w-3.5 h-3.5" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Tool Call</span>
                                    </div>
                                    <div className="font-mono text-xs text-text-primary break-all">
                                        <span className="text-primary font-semibold">{tool.name}</span>
                                        <span className="text-text-muted"> {JSON.stringify(tool.args)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5 bg-success/5 rounded-lg p-3 border border-success/10 ml-4">
                                    <div className="flex items-center gap-2 text-success">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Result</span>
                                    </div>
                                    <div className="font-mono text-xs text-text-primary break-all">
                                        {tool.result}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
