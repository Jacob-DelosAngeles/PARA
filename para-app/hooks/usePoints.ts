import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { PointsLedgerEntry, Profile } from '@/types';

export function usePoints() {
  const { session, profile } = useAuthStore();
  const userId = session?.user.id;

  const ledgerQuery = useQuery({
    queryKey: ['points_ledger', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('points_ledger')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as PointsLedgerEntry[];
    },
    enabled: !!userId,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, points, avatar_url')
        .order('points', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as Pick<Profile, 'id' | 'display_name' | 'points' | 'avatar_url'>[];
    },
    staleTime: 30000,
  });

  return {
    points: profile?.points ?? 0,
    ledger: ledgerQuery.data ?? [],
    leaderboard: leaderboardQuery.data ?? [],
    isLoading: ledgerQuery.isLoading || leaderboardQuery.isLoading,
  };
}
