import React, { useState } from 'react';
import { cn, formatDateTime } from '@/lib/utils';
import type { Trace, Step } from '../types';
import MetadataPanel from './MetadataPanel';

export interface TraceInspectorProps {
    trace: Trace;
    className?: string;
}

const TraceInspector: React.FC<TraceInspectorProps> = ({ trace, className }) => {
    const [selectedStep, setSelectedStep] = useState<Step | null>(null);
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

    const toggleStepExpansion = (stepId: string) => {
        const newExpanded = new Set(expandedSteps);
        if (newExpanded.has(stepId)) {
            newExpanded.delete(stepId);
        } else {
            newExpanded.add(stepId);
        }
        setExpandedSteps(newExpanded);
    };

    const getStatusColor = (status: Step['status']) => {
        switch (status) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'running':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    const calculatePosition = (step: Step) => {
        if (!trace.startTime || !step.startTime) return { left: 0, width: 0 };

        const traceStart = new Date(trace.startTime).getTime();
        const traceEnd = trace.endTime ? new Date(trace.endTime).getTime() : Date.now();
        const traceDuration = traceEnd - traceStart;

        const stepStart = new Date(step.startTime).getTime();
        const stepEnd = step.endTime ? new Date(step.endTime).getTime() : Date.now();
        const stepDuration = stepEnd - stepStart;

        const left = ((stepStart - traceStart) / traceDuration) * 100;
        const width = (stepDuration / traceDuration) * 100;

        return { left: `${left}%`, width: `${Math.max(width, 0.5)}%` };
    };

    const renderStep = (step: Step, depth = 0) => {
        const position = calculatePosition(step);
        const isExpanded = expandedSteps.has(step.id);
        const hasChildren = step.children && step.children.length > 0;

        return (
            <div key={step.id} className="mb-2">
                {/* Step Row */}
                <div
                    className={cn(
                        'flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-50 cursor-pointer transition-colors',
                        selectedStep?.id === step.id && 'bg-blue-50 border border-blue-200'
                    )}
                    onClick={() => setSelectedStep(step)}
                    style={{ paddingLeft: `${depth * 20 + 12}px` }}
                >
                    {/* Expand/Collapse */}
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleStepExpansion(step.id);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isExpanded ? '▼' : '▶'}
                        </button>
                    )}

                    {/* Step Name */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{step.name}</div>
                        <div className="text-xs text-gray-500">
                            {formatDateTime(step.startTime)} · {step.duration}ms
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div
                        className={cn(
                            'px-2 py-1 text-xs font-medium rounded text-white',
                            getStatusColor(step.status)
                        )}
                    >
                        {step.status}
                    </div>
                </div>

                {/* Waterfall Bar */}
                <div className="relative h-8 bg-gray-100 rounded mt-1 mx-3" style={{ marginLeft: `${depth * 20 + 12}px` }}>
                    <div
                        className={cn(
                            'absolute h-full rounded transition-all',
                            getStatusColor(step.status),
                            'opacity-70 hover:opacity-90'
                        )}
                        style={position}
                        title={`${step.name}: ${step.duration}ms`}
                    />
                </div>

                {/* Children */}
                {isExpanded && hasChildren && (
                    <div className="mt-2">
                        {step.children!.map((child) => renderStep(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={cn('flex gap-4 h-full', className)}>
            {/* Left: Waterfall Timeline */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{trace.name}</h2>
                    <p className="text-sm text-gray-500">
                        Duration: {trace.duration}ms · Steps: {trace.steps.length}
                    </p>
                </div>

                {/* Waterfall */}
                <div className="space-y-1">
                    {trace.steps.map((step) => renderStep(step))}
                </div>
            </div>

            {/* Right: Details Panel */}
            <div className="w-96 overflow-y-auto space-y-4">
                {selectedStep ? (
                    <>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step Details</h3>
                            <dl className="space-y-2 text-sm">
                                <div>
                                    <dt className="font-medium text-gray-700">Name:</dt>
                                    <dd className="text-gray-900">{selectedStep.name}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-700">Status:</dt>
                                    <dd className={cn('font-medium', {
                                        'text-green-600': selectedStep.status === 'success',
                                        'text-red-600': selectedStep.status === 'error',
                                        'text-blue-600': selectedStep.status === 'running',
                                        'text-gray-600': selectedStep.status === 'pending',
                                    })}>
                                        {selectedStep.status}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-700">Duration:</dt>
                                    <dd className="text-gray-900">{selectedStep.duration}ms</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-700">Start Time:</dt>
                                    <dd className="text-gray-900">{formatDateTime(selectedStep.startTime)}</dd>
                                </div>
                                {selectedStep.error && (
                                    <div>
                                        <dt className="font-medium text-red-700">Error:</dt>
                                        <dd className="text-red-600 font-mono text-xs">{selectedStep.error}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {selectedStep.metadata && (
                            <MetadataPanel metadata={selectedStep.metadata} title="Step Metadata" />
                        )}
                    </>
                ) : (
                    <MetadataPanel metadata={trace.metadata} title="Trace Metadata" />
                )}
            </div>
        </div>
    );
};

export default TraceInspector;
