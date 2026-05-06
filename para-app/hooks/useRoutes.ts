import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Route } from '@/types';

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: async (): Promise<Route[]> => {
      const { data, error } = await supabase
        .from('routes')
        .select('id, display_name, color_hex')
        .order('id', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Route[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
