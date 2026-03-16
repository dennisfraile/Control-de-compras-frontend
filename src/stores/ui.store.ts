import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaletteMode } from '@mui/material';

interface UIState {
  sidebarOpen: boolean;
  themeMode: PaletteMode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      themeMode: 'light',

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open: boolean) =>
        set({ sidebarOpen: open }),

      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
