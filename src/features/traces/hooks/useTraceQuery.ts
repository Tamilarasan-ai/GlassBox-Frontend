import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Trace, TraceFilters } from '../types';

interface UseTraceQueryOptions {
    filters?: TraceFilters;
    autoFetch?: boolean;
}

export function useTraceQuery(options: UseTraceQueryOptions = {}) {
    const { filters, autoFetch = true } = options;

    const [traces, setTraces] = useState<Trace[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTraces = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_ENDPOINTS.TRACES.LIST, {
                params: filters,
            });

            setTraces(response.data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch traces');
            setError(error);
            console.error('Failed to fetch traces:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTraceById = async (id: string): Promise<Trace | null> => {
        try {
            const response = await axios.get(API_ENDPOINTS.TRACES.DETAIL(id));
            return response.data;
        } catch (err) {
            console.error('Failed to fetch trace:', err);
            return null;
        }
    };

    const refetch = () => {
        fetchTraces();
    };

    useEffect(() => {
        if (autoFetch) {
            fetchTraces();
        }
    }, [JSON.stringify(filters)]);

    return {
        traces,
        isLoading,
        error,
        fetchTraces,
        fetchTraceById,
        refetch,
    };
}
