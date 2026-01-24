import React, { useState, useEffect } from 'react';
import { Table } from '../../types/database';

interface TableFormProps {
    initialData?: Partial<Table>;
    onSubmit: (data: { name: string; capacity: number }) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const TableForm: React.FC<TableFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [capacity, setCapacity] = useState(initialData?.capacity || 8);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Table name is required');
            return;
        }
        if (capacity < 1) {
            setError('Capacity must be at least 1');
            return;
        }
        setError(null);
        onSubmit({ name, capacity });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-slate-900">
                        {initialData?.id ? 'Edit Table' : 'New Table'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                            Table Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Family Table"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-1">
                            Capacity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCapacity(Math.max(1, capacity - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                id="capacity"
                                value={capacity}
                                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                                className="w-20 text-center px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                min="1"
                            />
                            <button
                                type="button"
                                onClick={() => setCapacity(capacity + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Maximum number of guests for this table.
                        </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Table'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
