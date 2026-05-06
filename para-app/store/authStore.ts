import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isGuest: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setGuest: (isGuest: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isGuest: false,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setGuest: (isGuest) => set({ isGuest }),
  clear: () => set({ session: null, profile: null, isGuest: false }),
}));
