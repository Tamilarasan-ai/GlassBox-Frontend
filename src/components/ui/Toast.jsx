import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const toastVariants = {
    default: 'bg-surface border-border-soft text-text-primary',
    success: 'bg-surface border-success/20 text-text-primary',
    error: 'bg-surface border-red-500/20 text-text-primary',
    warning: 'bg-surface border-yellow-500/20 text-text-primary',
    info: 'bg-surface border-blue-500/20 text-text-primary',
};

const toastIcons = {
    default: null,
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast, dismiss: removeToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-[420px] w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            'pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-full',
                            toastVariants[toast.variant]
                        )}
                    >
                        {toastIcons[toast.variant]}
                        <div className="flex-1 grid gap-1">
                            {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
                            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="absolute right-2 top-2 rounded-md p-1 text-text-secondary opacity-0 transition-opacity hover:text-text-primary focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
