import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaletteMode } from '@mui/material';

interface UIState {
  sidebarOpen: boolean;
  themeMode: PaletteMode;
  compactMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  toggleCompactMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      themeMode: 'light',
      compactMode: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open: boolean) =>
        set({ sidebarOpen: open }),

      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),

      toggleCompactMode: () =>
        set((state) => ({ compactMode: !state.compactMode })),
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({ themeMode: state.themeMode, compactMode: state.compactMode }),
    },
  ),
);
