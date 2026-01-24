import React, { useState, useMemo } from 'react';
import { GuestListItem } from './GuestListItem';
import { TableWithStats, RSVPExtended } from '../../types/database';

interface AssignmentViewProps {
    tables: TableWithStats[];
    rsvps: RSVPExtended[];
    onAssign: (rsvpId: string, tableId: string) => void;
    onUnassign: (assignmentId: string) => void;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({ tables, rsvps, onAssign, onUnassign }) => {
    const [filter, setFilter] = useState<'all' | 'assigned' | 'pending'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRSVPs = useMemo(() => {
        return rsvps.filter(rsvp => {
            // Filter by status
            if (filter === 'assigned' && !rsvp.assigned) return false;
            if (filter === 'pending' && rsvp.assigned) return false;

            // Filter by search
            if (searchTerm) {
                const name = (rsvp as any).name?.toLowerCase() || '';
                return name.includes(searchTerm.toLowerCase());
            }

            return true;
        });
    }, [rsvps, filter, searchTerm]);

    // Stats
    const totalGuests = rsvps.reduce((acc, r) => acc + r.guests_confirmed, 0);
    const assignedGuests = rsvps
        .filter(r => r.assigned)
        .reduce((acc, r) => acc + r.guests_confirmed, 0);

    const pendingGuests = totalGuests - assignedGuests;

    const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
    const remainingCapacity = totalCapacity - assignedGuests;

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[700px]">

            {/* Header Section */}
            <div className="p-6 border-b border-slate-100 bg-white z-10">
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Guest Assignments</h2>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-slate-500">Total Guests:</span> <strong className="text-slate-900 ml-1">{totalGuests}</strong>
                            </div>
                            <div className="px-3 py-1 bg-teal-50 rounded-lg border border-teal-100">
                                <span className="text-teal-600">Assigned:</span> <strong className="text-teal-700 ml-1">{assignedGuests}</strong>
                            </div>
                            <div className="px-3 py-1 bg-orange-50 rounded-lg border border-orange-100">
                                <span className="text-orange-600">Pending:</span> <strong className="text-orange-700 ml-1">{pendingGuests}</strong>
                            </div>
                            <div className="px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                                <span className="text-indigo-600">Capacity Left:</span> <strong className="text-indigo-700 ml-1">{remainingCapacity}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative flex-1 xl:flex-none">
                            <input
                                type="text"
                                placeholder="Search guests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-full xl:w-72 transition-all"
                            />
                            <svg className="absolute left-3.5 top-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <option value="all">All Guests</option>
                            <option value="pending">Pending Only</option>
                            <option value="assigned">Assigned Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4">
                {filteredRSVPs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <p>No guests found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredRSVPs.map(rsvp => (
                            <GuestListItem
                                key={rsvp.id}
                                rsvp={rsvp}
                                tables={tables}
                                onAssign={onAssign}
                                onUnassign={onUnassign}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
