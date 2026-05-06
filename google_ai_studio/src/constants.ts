export interface RouteInfo {
  id: string;
  name: string;
  subtitle: string;
  wait: number;
  distance: string;
  status?: 'Full' | 'Seats Left' | 'Normal';
  seats?: number;
}

export const NEARBY_ROUTES: RouteInfo[] = [
  {
    id: "17B",
    name: "Ayala - Pasay",
    subtitle: "Every 8 mins • 250m away",
    wait: 12,
    status: 'Full'
  },
  {
    id: "01C",
    name: "SM North - QC",
    subtitle: "Every 15 mins • 400m away",
    wait: 18,
    status: 'Seats Left',
    seats: 4
  },
  {
    id: "04L",
    name: "Guadalupe - Market",
    subtitle: "Every 5 mins • 100m away",
    wait: 5,
    status: 'Seats Left',
    seats: 3
  }
];

export const DRIVER_STATS = {
  nextTurn: "300m • EDSA Guadalupe",
  arrival: "14:32",
  timeToArrival: 4,
  seatsFilled: 12,
  totalSeats: 18,
  zone: "River North",
  demandAlert: "EDSA - Guadalupe zone is glowing red.",
  demandSub: "Expect +15 pickups in the next 10 minutes."
};
