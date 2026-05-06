import { create } from 'zustand';
import type { Coords } from '@/types';

interface LocationState {
  coords: Coords | null;
  setLocation: (coords: Coords) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: null,
  setLocation: (coords) => set({ coords }),
}));
