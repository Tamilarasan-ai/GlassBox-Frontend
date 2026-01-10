import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Something went wrong</h3>
                        <p className="text-sm text-text-secondary max-w-md mt-1">
                            {this.state.error?.message || 'An unexpected error occurred in this component.'}
                        </p>
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-surface hover:bg-white/5 border border-border-soft rounded-lg text-sm font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
