import { create } from 'zustand';
import type { Coords } from '@/types';

interface DestinationState {
  destination: Coords | null;
  selectedRouteIds: string[];
  setDestination: (coords: Coords) => void;
  clearDestination: () => void;
  toggleRoute: (id: string) => void;
  setSelectedRoutes: (ids: string[]) => void;
  clearSelectedRoutes: () => void;
}

export const useDestinationStore = create<DestinationState>((set) => ({
  destination: null,
  selectedRouteIds: [],
  setDestination: (destination) => set({ destination }),
  clearDestination: () => set({ destination: null }),
  toggleRoute: (id) =>
    set((s) => ({
      selectedRouteIds: s.selectedRouteIds.includes(id)
        ? s.selectedRouteIds.filter((r) => r !== id)
        : [...s.selectedRouteIds, id],
    })),
  setSelectedRoutes: (selectedRouteIds) => set({ selectedRouteIds }),
  clearSelectedRoutes: () => set({ selectedRouteIds: [] }),
}));
