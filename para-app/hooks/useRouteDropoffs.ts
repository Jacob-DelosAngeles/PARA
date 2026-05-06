import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Dropoff {
  signal_id: string;
  lat: number;
  lng: number;
  fare_php: number | null;
}

interface DropoffRow {
  signal_id: string;
  lat: number;
  lng: number;
  fare_php: number | null;
}

/**
 * Drop-off destinations for every active demand_signal that selected
 * the driver's route. Refreshes on realtime inserts + every 60s as a backstop.
 */
export function useRouteDropoffs(routeId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['route-dropoffs', routeId],
    queryFn: async (): Promise<Dropoff[]> => {
      if (!routeId) return [];
      const { data, error } = await supabase.rpc('route_dropoffs', { p_route_id: routeId });
      if (error) throw error;
      return (data as DropoffRow[]) ?? [];
    },
    enabled: !!routeId,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!routeId) return;
    const channel = supabase
      .channel(`dropoffs-${routeId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demand_signals' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['route-dropoffs', routeId] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [routeId, queryClient]);

  return query.data ?? [];
}
