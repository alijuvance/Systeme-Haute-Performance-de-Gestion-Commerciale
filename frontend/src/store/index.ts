import { create } from 'zustand';

interface GlobalState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

// Exemple de store global léger (Zustand) pour gérer l'état de l'UI
export const useGlobalStore = create<GlobalState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));
