import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/store/locationStore';
import type { HeatmapPoint } from '@/components/map/DemandHeatmap';

interface DemandDensityRow {
  demand_count: number;
  hotspot_lat: number;
  hotspot_lng: number;
}

interface RouteHeatmapRow {
  lat: number;
  lng: number;
  weight: number;
}

/**
 * Aggregate demand around the user's current location (commuter view).
 */
export function useDemandSignals(radiusM = 3000) {
  const coords = useLocationStore((s) => s.coords);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['demand', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords) return { count: 0, hotspot: null };
      const { data, error } = await supabase.rpc('demand_density', {
        lat: coords.latitude,
        lng: coords.longitude,
        radius_m: radiusM,
      });
      if (error) throw error;
      const row = (data as DemandDensityRow[])[0];
      if (!row || row.demand_count === 0) return { count: 0, hotspot: null };
      return {
        count: Number(row.demand_count),
        hotspot: { latitude: row.hotspot_lat, longitude: row.hotspot_lng },
      };
    },
    enabled: !!coords,
    staleTime: 10000,
    refetchInterval: 15000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('demand-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demand_signals' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['demand'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query.data ?? { count: 0, hotspot: null };
}

/**
 * Heatmap points along a specific route (driver view).
 * Refetches every 3 minutes (matches commuter cooldown cadence) and on realtime inserts.
 */
export function useRouteDemandHeatmap(routeId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['demand-heatmap', routeId],
    queryFn: async (): Promise<HeatmapPoint[]> => {
      if (!routeId) return [];
      const { data, error } = await supabase.rpc('route_demand_heatmap', {
        p_route_id: routeId,
      });
      if (error) throw error;
      return (data as RouteHeatmapRow[]).map((r) => ({
        latitude: r.lat,
        longitude: r.lng,
        weight: r.weight,
      }));
    },
    enabled: !!routeId,
    staleTime: 60_000,
    refetchInterval: 180_000, // 3 minutes
  });

  useEffect(() => {
    if (!routeId) return;
    const channel = supabase
      .channel(`demand-heatmap-${routeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'demand_signals' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['demand-heatmap', routeId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [routeId, queryClient]);

  return query.data ?? [];
}
