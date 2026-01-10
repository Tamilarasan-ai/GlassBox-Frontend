import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import Button from './button';

export function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Continue',
    cancelText = 'Cancel',
    variant = 'default', // default, destructive
    isLoading = false,
}) {
    const modalRef = useRef(null);

    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                ref={modalRef}
                className="relative z-50 grid w-full max-w-lg gap-4 border border-border-soft bg-panel p-6 shadow-lg duration-200 animate-in zoom-in-95 sm:rounded-lg mx-4"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h2 id="alert-dialog-title" className="text-lg font-semibold text-text-primary">
                        {title}
                    </h2>
                    <p id="alert-dialog-description" className="text-sm text-text-secondary">
                        {description}
                    </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-transparent text-text-primary hover:bg-surface border-input"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'destructive' ? 'destructive' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
