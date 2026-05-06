import { create } from 'zustand';

interface DriverState {
  activeRouteId: string | null;
  setActiveRouteId: (id: string | null) => void;
  clear: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  activeRouteId: null,
  setActiveRouteId: (activeRouteId) => set({ activeRouteId }),
  clear: () => set({ activeRouteId: null }),
}));
