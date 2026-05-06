import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Profile } from '@/types';

export function useAuth() {
  const { session, profile, isGuest, setSession, setProfile, setGuest, clear } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id);
      } else if (!isGuest) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as Profile);
  }

  async function signOut() {
    await supabase.auth.signOut();
    clear();
  }

  return { session, profile, isGuest, setGuest, signOut };
}
