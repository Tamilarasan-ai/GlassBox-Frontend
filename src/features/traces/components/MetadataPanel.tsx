import React from 'react';
import { cn } from '@/lib/utils';
import type { Metadata } from '../types';

export interface MetadataPanelProps {
    metadata: Metadata;
    title?: string;
    className?: string;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
    metadata,
    title = 'Metadata',
    className,
}) => {
    const renderValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400">null</span>;
        }

        if (typeof value === 'boolean') {
            return <span className="text-purple-600">{value.toString()}</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-blue-600">{value}</span>;
        }

        if (typeof value === 'string') {
            return <span className="text-green-600">"{value}"</span>;
        }

        if (Array.isArray(value)) {
            return (
                <details className="ml-4">
                    <summary className="cursor-pointer text-gray-600">Array [{value.length}]</summary>
                    <div className="ml-4 border-l-2 border-gray-200 pl-2">
                        {value.map((item, index) => (
                            <div key={index} className="py-1">
                                <span className="text-gray-500">[{index}]:</span> {renderValue(item)}
                            </div>
                        ))}
                    </div>
                </details>
            );
        }

        if (typeof value === 'object') {
            return (
                <details className="ml-4">
                    <summary className="cursor-pointer text-gray-600">
                        Object {'{'}...{'}'}
                    </summary>
                    <div className="ml-4 border-l-2 border-gray-200 pl-2">
                        {Object.entries(value).map(([key, val]) => (
                            <div key={key} className="py-1">
                                <span className="font-medium text-gray-700">{key}:</span> {renderValue(val)}
                            </div>
                        ))}
                    </div>
                </details>
            );
        }

        return <span>{String(value)}</span>;
    };

    return (
        <div className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            {Object.keys(metadata).length === 0 ? (
                <p className="text-gray-400 text-sm">No metadata available</p>
            ) : (
                <div className="space-y-2 font-mono text-sm">
                    {Object.entries(metadata).map(([key, value]) => (
                        <div key={key} className="flex flex-col py-2 border-b border-gray-100 last:border-0">
                            <span className="font-semibold text-gray-700 mb-1">{key}:</span>
                            <div className="pl-4">{renderValue(value)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MetadataPanel;
