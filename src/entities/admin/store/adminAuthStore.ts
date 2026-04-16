import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, Store, AdminPlan } from '../types/admin.types';

interface AdminAuthState {
  user: AdminUser | null;
  store: Store | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AdminUser, store: Store, token: string) => void;
  logout: () => void;
  updateStore: (data: Partial<Store>) => void;
  setUser: (user: AdminUser) => void;
  getCurrentPlan: () => AdminPlan;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      store: null,
      token: null,
      isAuthenticated: false,

      login: (user, store, token) => {
        set({ user, store, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, store: null, token: null, isAuthenticated: false });
      },

      updateStore: (data) => {
        const current = get().store;
        if (!current) return;
        set({ store: { ...current, ...data } });
      },

      setUser: (user) => set({ user }),

      getCurrentPlan: () => get().user?.plan ?? 'free',
    }),
    { name: 'emarketpro-admin-auth' }
  )
);
