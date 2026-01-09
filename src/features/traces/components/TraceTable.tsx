import React, { useState } from 'react';
import { cn, formatDateTime } from '@/lib/utils';
import type { Trace } from '../types';

export interface TraceTableProps {
    traces: Trace[];
    onTraceClick?: (trace: Trace) => void;
    isLoading?: boolean;
    className?: string;
}

const TraceTable: React.FC<TraceTableProps> = ({
    traces,
    onTraceClick,
    isLoading = false,
    className,
}) => {
    const [sortBy, setSortBy] = useState<'name' | 'startTime' | 'duration' | 'status'>('startTime');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedTraces = [...traces].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'startTime':
                comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                break;
            case 'duration':
                comparison = (a.duration || 0) - (b.duration || 0);
                break;
            case 'status':
                comparison = a.status.localeCompare(b.status);
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleHeaderClick = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getStatusColor = (status: Trace['status']) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'running':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading traces...</div>
            </div>
        );
    }

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {[
                            { key: 'name', label: 'Name' },
                            { key: 'status', label: 'Status' },
                            { key: 'startTime', label: 'Start Time' },
                            { key: 'duration', label: 'Duration' },
                        ].map(({ key, label }) => (
                            <th
                                key={key}
                                onClick={() => handleHeaderClick(key as typeof sortBy)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    {label}
                                    {sortBy === key && (
                                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTraces.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                No traces found
                            </td>
                        </tr>
                    ) : (
                        sortedTraces.map((trace) => (
                            <tr
                                key={trace.id}
                                onClick={() => onTraceClick?.(trace)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{trace.name}</div>
                                    <div className="text-xs text-gray-500">{trace.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={cn(
                                            'px-2 py-1 text-xs font-medium rounded-full',
                                            getStatusColor(trace.status)
                                        )}
                                    >
                                        {trace.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDateTime(trace.startTime)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {trace.duration ? `${trace.duration}ms` : '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TraceTable;
