import type { Coords } from '@/types';

const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle distance between two coordinates in kilometers.
 * Mirrors PostGIS ST_DistanceSphere for quick client-side estimates.
 */
export function haversineKm(a: Coords, b: Coords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * LTFRB jeepney fare: ₱13 base for first 4km, +₱1.80 per km after, rounded up.
 */
export function farePhp(distanceKm: number): number {
  if (distanceKm <= 4) return 13;
  return Math.ceil(13 + (distanceKm - 4) * 1.8);
}
