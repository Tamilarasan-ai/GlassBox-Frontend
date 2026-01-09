// Environment variables
export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    CHAT: {
        SESSIONS: '/chat/sessions',
        MESSAGES: '/chat/messages',
        STREAM: '/chat/stream',
    },
    TRACES: {
        LIST: '/traces',
        DETAIL: (id: string) => `/traces/${id}`,
        REPLAY: (id: string) => `/traces/${id}/replay`,
    },
} as const;

// Application constants
export const APP_NAME = 'Innowhyte';
export const APP_VERSION = '1.0.0';

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
    API_REQUEST: 30000,
    DEBOUNCE_SEARCH: 300,
    TOAST_DURATION: 3000,
} as const;
