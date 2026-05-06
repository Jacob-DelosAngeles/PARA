import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/store/locationStore';
import type { Vehicle } from '@/types';

interface NearbyVehicleRow {
  id: string;
  route_id: string;
  heading: number | null;
  seats_total: number;
  seats_filled: number;
  dist_m: number;
  lng_out: number;
  lat_out: number;
}

export function useNearbyVehicles(radiusM = 2000) {
  const coords = useLocationStore((s) => s.coords);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vehicles', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords) return [];
      const { data, error } = await supabase.rpc('nearby_vehicles', {
        lat: coords.latitude,
        lng: coords.longitude,
        radius_m: radiusM,
      });
      if (error) throw error;
      return (data as NearbyVehicleRow[]).map((v) => ({
        id: v.id,
        route_id: v.route_id,
        heading: v.heading,
        seats_total: v.seats_total,
        seats_filled: v.seats_filled,
        dist_m: v.dist_m,
        lat: v.lat_out,
        lng: v.lng_out,
      }));
    },
    enabled: !!coords,
    staleTime: 5000,
    refetchInterval: 8000,
  });

  // Realtime subscription patches the cached data instantly
  useEffect(() => {
    const channel = supabase
      .channel('vehicles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query.data ?? [];
}
