export interface Table {
  id: string;
  event_id: string;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface SeatAssignment {
  id: string;
  table_id: string;
  rsvp_id: string;
  guests_assigned: number;
  created_at: string;
}

// Extended types for UI helpers
export interface TableWithStats extends Table {
  guests_assigned: number;
  occupancy_percentage: number;
  is_full: boolean;
}

export interface RSVPExtended {
  id: string;
  // ... other RSVP fields
  guests_confirmed: number;
  assigned: boolean; // Derived field
  assignment?: SeatAssignment;
}
