import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Store, StoreTheme } from '../types/admin.types';

interface StoreState {
  store: Store | null;
  isLoading: boolean;
  setStore: (store: Store) => void;
  updateStore: (data: Partial<Store>) => void;
  updateTheme: (theme: Partial<StoreTheme>) => void;
  clearStore: () => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      store: null,
      isLoading: false,

      setStore: (store) => set({ store }),

      updateStore: (data) => {
        const current = get().store;
        if (!current) return;
        set({ store: { ...current, ...data } });
      },

      updateTheme: (theme) => {
        const current = get().store;
        if (!current) return;
        set({ store: { ...current, theme: { ...current.theme, ...theme } } });
      },

      clearStore: () => set({ store: null }),
    }),
    { name: 'emarketpro-admin-store' }
  )
);
