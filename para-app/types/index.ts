export interface Profile {
  id: string;
  display_name: string;
  role: 'commuter' | 'driver';
  avatar_url: string | null;
  points: number;
  created_at: string;
}

export interface Route {
  id: string;
  display_name: string;
  color_hex: string;
  geom?: unknown;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  route_id: string | null;
  location: { type: 'Point'; coordinates: [number, number] };
  heading: number | null;
  seats_total: number;
  seats_filled: number;
  is_active: boolean;
  updated_at: string;
  dist_m?: number;
  lat?: number;
  lng?: number;
}

export interface DemandSignal {
  id: string;
  user_id: string | null;
  location: { type: 'Point'; coordinates: [number, number] };
  route_id: string | null;
  expires_at: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  type: 'accident' | 'pothole' | 'traffic';
  description: string | null;
  location: { type: 'Point'; coordinates: [number, number] };
  image_url: string | null;
  is_verified: boolean;
  verify_count: number;
  expires_at: string;
  created_at: string;
  lat?: number;
  lng?: number;
}

export interface PointsLedgerEntry {
  id: string;
  user_id: string;
  delta: number;
  reason: string;
  ref_id: string | null;
  created_at: string;
}

export interface RouteInfo {
  id: string;
  name: string;
  subtitle: string;
  wait: number;
  distance?: string;
  status?: 'Full' | 'Seats Left' | 'Normal';
  seats?: number;
}

export interface DriverStats {
  nextTurn: string;
  arrival: string;
  timeToArrival: number;
  seatsFilled: number;
  totalSeats: number;
  zone: string;
  demandAlert: string;
  demandSub: string;
}

export interface Coords {
  latitude: number;
  longitude: number;
  heading?: number;
  accuracy?: number;
}
