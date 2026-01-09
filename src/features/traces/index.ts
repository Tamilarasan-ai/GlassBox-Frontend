// Public API for traces feature module

// Types
export type {
    Trace,
    Step,
    Metadata,
    TraceEvent,
    TraceFilters,
    TracesState,
} from './types';

// Components
export { default as TraceTable } from './components/TraceTable';
export { default as TraceInspector } from './components/TraceInspector';
export { default as MetadataPanel } from './components/MetadataPanel';

// Hooks
export { useTraceQuery } from './hooks/useTraceQuery';
export { useReplayTrace } from './hooks/useReplayTrace';
export type { PlaybackSpeed } from './hooks/useReplayTrace';
