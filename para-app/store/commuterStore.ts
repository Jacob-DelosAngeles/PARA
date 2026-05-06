import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CommuterState {
  cooldownStartedAt: number | null;
  setCooldown: (ts: number) => void;
  clearCooldown: () => void;
}

export const useCommuterStore = create<CommuterState>()(
  persist(
    (set) => ({
      cooldownStartedAt: null,
      setCooldown: (cooldownStartedAt) => set({ cooldownStartedAt }),
      clearCooldown: () => set({ cooldownStartedAt: null }),
    }),
    {
      name: 'para-commuter',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const PARA_COOLDOWN_MS = 3 * 60 * 1000;

export function getRemainingCooldownMs(startedAt: number | null): number {
  if (!startedAt) return 0;
  const elapsed = Date.now() - startedAt;
  return Math.max(0, PARA_COOLDOWN_MS - elapsed);
}
