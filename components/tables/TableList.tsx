import React from 'react';
import { TableCard } from './TableCard';
import { TableWithStats } from '../../types/database';

interface TableListProps {
    tables: TableWithStats[];
    onEdit: (table: TableWithStats) => void;
    onDelete: (tableId: string) => void;
    onAssign: (tableId: string) => void;
    onCreate: () => void;
}

export const TableList: React.FC<TableListProps> = ({ tables, onEdit, onDelete, onAssign, onCreate }) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Seating Plan</h2>
                    <p className="text-slate-500 mt-1">Organize your event layout and guest assignments.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    Add New Table
                </button>
            </div>

            {tables.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No tables yet</h3>
                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">Get started by creating your first table for the event.</p>
                    <button onClick={onCreate} className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Create Table &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map(table => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAssign={onAssign}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
