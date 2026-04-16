import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
}

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      darkMode: true,

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

      toggleDarkMode: () => {
        const next = !get().darkMode;
        applyTheme(next);
        set({ darkMode: next });
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'emarketpro-ui',
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.darkMode ?? true);
      },
    }
  )
);
