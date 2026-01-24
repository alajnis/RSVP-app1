import React from 'react';
import { TableWithStats } from '../../types/database';

interface TableCardProps {
    table: TableWithStats;
    onEdit: (table: TableWithStats) => void;
    onDelete: (tableId: string) => void;
    onAssign: (tableId: string) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onEdit, onDelete, onAssign }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all p-5 group relative overflow-hidden">

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-50 to-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="font-bold text-xl text-slate-800 tracking-tight">{table.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-2 inline-block ${table.is_full ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-teal-50 text-teal-700 border border-teal-100'
                        }`}>
                        {table.guests_assigned} / {table.capacity} guests
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(table)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                        aria-label="Edit table"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button
                        onClick={() => onDelete(table.id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        aria-label="Delete table"
                        disabled={table.guests_assigned > 0}
                        title={table.guests_assigned > 0 ? "Cannot delete table with guests" : "Delete table"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${table.is_full ? 'bg-red-400' :
                            table.occupancy_percentage >= 80 ? 'bg-yellow-400' : 'bg-teal-500'
                        }`}
                    style={{ width: `${Math.min(table.occupancy_percentage, 100)}%` }}
                ></div>
            </div>

            <button
                onClick={() => onAssign(table.id)}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
                <span>Manage Guests</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
        </div>
    );
};
