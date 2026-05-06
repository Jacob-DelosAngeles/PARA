import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useDriverStore } from '@/store/driverStore';

interface DriverVehicle {
  id: string;
  seats_total: number;
  seats_filled: number;
  route_id: string | null;
}

export function useDriverVehicle() {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const coords = useLocationStore((s) => s.coords);
  const activeRouteId = useDriverStore((s) => s.activeRouteId);

  const [vehicle, setVehicle] = useState<DriverVehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch or create the driver's active vehicle row when they pick a route
  useEffect(() => {
    if (!session || profile?.role !== 'driver' || !activeRouteId || !coords) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      // Look for an active vehicle row for this driver
      const { data: existing } = await supabase
        .from('vehicles')
        .select('id, seats_total, seats_filled, route_id')
        .eq('driver_id', session.user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (existing) {
        // Update route + location on existing row
        const { data } = await supabase
          .from('vehicles')
          .update({
            route_id: activeRouteId,
            location: `POINT(${coords.longitude} ${coords.latitude})`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select('id, seats_total, seats_filled, route_id')
          .single();
        if (!cancelled && data) setVehicle(data);
      } else {
        // Insert new vehicle row
        const { data } = await supabase
          .from('vehicles')
          .insert({
            driver_id: session.user.id,
            route_id: activeRouteId,
            location: `POINT(${coords.longitude} ${coords.latitude})`,
          })
          .select('id, seats_total, seats_filled, route_id')
          .single();
        if (!cancelled && data) setVehicle(data);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session, profile?.role, activeRouteId]);

  // Debounced server update
  function setSeatsFilled(next: number) {
    if (!vehicle) return;
    const clamped = Math.max(0, Math.min(vehicle.seats_total, next));
    setVehicle({ ...vehicle, seats_filled: clamped });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase
        .from('vehicles')
        .update({
          seats_filled: clamped,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vehicle.id);
    }, 500);
  }

  const seatsAvailable = vehicle ? vehicle.seats_total - vehicle.seats_filled : 0;

  return {
    vehicle,
    loading,
    seatsAvailable,
    seatsTotal: vehicle?.seats_total ?? 18,
    increment: () => vehicle && setSeatsFilled(vehicle.seats_filled - 1),
    decrement: () => vehicle && setSeatsFilled(vehicle.seats_filled + 1),
  };
}
