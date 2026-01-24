import React from 'react';
import { RSVPExtended, TableWithStats } from '../../types/database';

interface GuestListItemProps {
    rsvp: RSVPExtended;
    tables: TableWithStats[];
    onAssign: (rsvpId: string, tableId: string) => void;
    onUnassign: (assignmentId: string) => void;
}

export const GuestListItem: React.FC<GuestListItemProps> = ({ rsvp, tables, onAssign, onUnassign }) => {
    const currentTableId = rsvp.assignment?.table_id || '';

    const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTableId = e.target.value;
        if (newTableId) {
            onAssign(rsvp.id, newTableId);
        } else if (rsvp.assignment?.id) {
            onUnassign(rsvp.assignment.id);
        }
    };

    // Generate initials for avatar
    const name = (rsvp as any).name || "Guest";
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

    // Random pastel color for avatar based on name length
    const colors = ['bg-red-100 text-red-600', 'bg-orange-100 text-orange-600', 'bg-amber-100 text-amber-600', 'bg-green-100 text-green-600', 'bg-teal-100 text-teal-600', 'bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600'];
    const colorIndex = name.length % colors.length;
    const avatarClass = colors[colorIndex];

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-4 group">

            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarClass}`}>
                    {initials}
                </div>

                <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {name}
                        {rsvp.assigned && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 block sm:hidden"></span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            {rsvp.guests_confirmed} guests
                        </span>
                        {rsvp.assigned ? (
                            <span className="hidden sm:inline-flex text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Assigned
                            </span>
                        ) : (
                            <span className="hidden sm:inline-flex text-[10px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Pending
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-auto pl-14 sm:pl-0">
                <div className="relative">
                    <select
                        value={currentTableId}
                        onChange={handleTableChange}
                        className={`w-full sm:w-56 pl-3 pr-10 py-2 text-sm rounded-lg border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium ${currentTableId
                                ? 'bg-teal-50 border-teal-200 text-teal-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                    >
                        <option value="">Select a table...</option>
                        {tables.map(table => {
                            const isFull = table.is_full && table.id !== currentTableId;
                            return (
                                <option
                                    key={table.id}
                                    value={table.id}
                                    disabled={isFull}
                                    className={isFull ? 'text-slate-300 bg-slate-50' : 'text-slate-900'}
                                >
                                    {table.name} ({table.guests_assigned}/{table.capacity})
                                </option>
                            );
                        })}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-current opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
