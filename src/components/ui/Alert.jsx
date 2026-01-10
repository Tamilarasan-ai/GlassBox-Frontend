import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = {
    default: 'bg-surface border-border-soft text-text-primary',
    destructive: 'bg-red-500/10 border-red-500/20 text-red-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
};

const alertIcons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertCircle,
    info: Info,
};

export function Alert({
    className,
    variant = 'default',
    title,
    children,
    icon,
    ...props
}) {
    const Icon = icon || alertIcons[variant];

    return (
        <div
            role="alert"
            className={cn(
                'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
                alertVariants[variant],
                className
            )}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4" />}
            <div className="flex flex-col gap-1">
                {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
                <div className="text-sm [&_p]:leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

export function AlertTitle({ className, children, ...props }) {
    return (
        <h5
            className={cn('mb-1 font-medium leading-none tracking-tight', className)}
            {...props}
        >
            {children}
        </h5>
    );
}

export function AlertDescription({ className, children, ...props }) {
    return (
        <div
            className={cn('text-sm [&_p]:leading-relaxed', className)}
            {...props}
        >
            {children}
        </div>
    );
}
