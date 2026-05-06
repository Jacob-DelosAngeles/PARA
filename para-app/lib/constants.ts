import type { RouteInfo, DriverStats } from '@/types';

export const COLORS = {
  primary: '#00236f',
  primaryContainer: '#1e3a8a',
  primaryFixed: '#dce1ff',
  primaryFixedDim: '#b6c4ff',
  onPrimary: '#ffffff',
  secondary: '#0058be',
  secondaryContainer: '#2170e4',
  onSecondary: '#ffffff',
  surface: '#f7f9fb',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  onSurface: '#191c1e',
  onSurfaceVariant: '#444651',
  outline: '#757682',
  outlineVariant: '#c5c5d3',
  surfaceTint: '#4059aa',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
} as const;

export const NEARBY_ROUTES: RouteInfo[] = [
  {
    id: '17B',
    name: 'Ayala - Pasay',
    subtitle: 'Every 8 mins • 250m away',
    wait: 12,
    status: 'Full',
  },
  {
    id: '01C',
    name: 'SM North - QC',
    subtitle: 'Every 15 mins • 400m away',
    wait: 18,
    status: 'Seats Left',
    seats: 4,
  },
  {
    id: '04L',
    name: 'Guadalupe - Market',
    subtitle: 'Every 5 mins • 100m away',
    wait: 5,
    status: 'Seats Left',
    seats: 3,
  },
];

export const DRIVER_STATS: DriverStats = {
  nextTurn: '300m • EDSA Guadalupe',
  arrival: '14:32',
  timeToArrival: 4,
  seatsFilled: 12,
  totalSeats: 18,
  zone: 'River North',
  demandAlert: 'EDSA - Guadalupe zone is glowing red.',
  demandSub: 'Expect +15 pickups in the next 10 minutes.',
};

// Manila default region
export const DEFAULT_REGION = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const POINTS = {
  reportSubmitted: 10,
  reportValidated: 5,
} as const;
