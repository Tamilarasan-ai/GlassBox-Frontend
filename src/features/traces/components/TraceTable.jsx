/**
 * Trace Table Component
 * 
 * Displays list of agent execution traces with metrics
 */
/**
 * Trace Table Component
 * 
 * Displays list of agent execution traces with metrics
 */

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { getTraces, deleteTrace } from '../../../services/api/tracesApi';
import TraceDetailModal from './TraceDetailModal';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useToast } from '@/components/ui/Toast';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';

// End of TraceTable component
export default function TraceTable() {
    // ...
    const [selectedTraceId, setSelectedTraceId] = useState(null);
    const [traces, setTraces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [traceToDelete, setTraceToDelete] = useState(null);
    const { toast } = useToast();

    const fetchTraces = async () => {
        try {
            // Don't set loading to true on refresh to avoid flicker
            if (traces.length === 0) setIsLoading(true);
            const data = await getTraces({ limit: 20 });
            setTraces(data.traces);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch traces:', err);
            setError('Failed to load traces. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (e, traceId) => {
        e.stopPropagation();
        setTraceToDelete(traceId);
    };

    const handleDelete = async () => {
        if (!traceToDelete) return;

        const traceId = traceToDelete;
        try {
            setDeletingId(traceId);
            await deleteTrace(traceId);
            // Optimistic update
            setTraces(prev => prev.filter(t => t.id !== traceId));
            setTotal(prev => prev - 1);
            toast({
                title: "Trace deleted",
                description: "The trace has been successfully removed.",
                variant: "success",
            });
        } catch (err) {
            console.error('Failed to delete trace:', err);
            toast({
                title: "Error",
                description: "Failed to delete trace. Please try again.",
                variant: "error",
            });
        } finally {
            setDeletingId(null);
            setTraceToDelete(null);
        }
    };

    useEffect(() => {
        fetchTraces();

        // Refresh every 10 seconds to show new runs
        const interval = setInterval(fetchTraces, 10000);
        return () => clearInterval(interval);
    }, []);

    // Format helpers
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatCost = (cost) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 6,
        }).format(cost || 0);
    };

    const formatLatency = (ms) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    if (isLoading && traces.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-text-primary">Trace History</h2>
                <div className="px-3 py-1 bg-surface border border-border-soft rounded-full text-xs font-medium text-text-secondary">
                    {total} Total Runs
                </div>
            </div>

            <div className="bg-surface border border-border-soft rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-panel border-b border-border-soft text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                <th className="px-6 py-4 w-32">Status</th>
                                <th className="px-6 py-4 w-32">Trace ID</th>
                                <th className="px-6 py-4">Input Preview</th>
                                <th className="px-6 py-4 w-24 text-right">Tokens</th>
                                <th className="px-6 py-4 w-24 text-right">Latency</th>
                                <th className="px-6 py-4 w-24 text-right">Cost</th>
                                <th className="px-6 py-4 w-32 text-right">Time</th>
                                <th className="px-6 py-4 w-20 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider">
                            {traces.map((trace) => (
                                <tr
                                    key={trace.id}
                                    onClick={() => setSelectedTraceId(trace.id)}
                                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                >
                                    {/* ... (other cells unchanged) */}
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${trace.is_successful
                                            ? 'bg-success/10 text-success border-success/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {trace.is_successful ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5" />
                                            )}
                                            {trace.is_successful ? 'Success' : 'Error'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-text-secondary bg-panel px-2 py-1 rounded border border-border-soft">
                                            {trace.id.slice(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-text-primary font-medium truncate max-w-md">
                                            {trace.user_input}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-text-secondary font-mono">
                                        {trace.total_tokens}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-text-secondary font-mono">
                                        {formatLatency(trace.latency_ms)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-text-secondary font-mono">
                                        {formatCost(trace.total_cost)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-text-muted">
                                        {formatTime(trace.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => confirmDelete(e, trace.id)}
                                                disabled={deletingId === trace.id}
                                                className="p-1.5 text-text-disabled hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                title="Delete Trace"
                                            >
                                                {deletingId === trace.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                            <ChevronRight className="w-4 h-4 text-text-disabled group-hover:text-text-secondary transition-colors" />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {traces.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-text-muted">
                                        No traces found. Run the agent to generate data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trace Detail Modal */}
            {selectedTraceId && (
                <ErrorBoundary>
                    <TraceDetailModal
                        traceId={selectedTraceId}
                        onClose={() => setSelectedTraceId(null)}
                    />
                </ErrorBoundary>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={!!traceToDelete}
                onClose={() => setTraceToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Trace"
                description="Are you sure you want to delete this trace? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                isLoading={!!deletingId}
            />
        </div>
    );
}
