// Traces-related TypeScript types

export interface TraceEvent {
    timestamp: Date;
    type: string;
    data?: any;
}

export interface Step {
    id: string;
    name: string;
    startTime: Date;
    endTime?: Date;
    duration?: number; // in milliseconds
    status: 'pending' | 'running' | 'success' | 'error';
    input?: any;
    output?: any;
    error?: string;
    metadata?: Record<string, any>;
    children?: Step[];
}

export interface Metadata {
    [key: string]: any;
}

export interface Trace {
    id: string;
    name: string;
    userId?: string;
    sessionId?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    status: 'pending' | 'running' | 'success' | 'error';
    steps: Step[];
    metadata: Metadata;
    tags?: string[];
}

export interface TraceFilters {
    status?: Trace['status'];
    userId?: string;
    sessionId?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
}

export interface TracesState {
    traces: Trace[];
    selectedTrace: Trace | null;
    isLoading: boolean;
    error: string | null;
    filters: TraceFilters;
}
