import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminSettings, UpdateSettingsInput } from '../types/settings.types';
import type { AdminPlan } from '../types/admin.types';

interface AdminSettingsState {
  settings: AdminSettings | null;
  isLoading: boolean;
  setSettings: (settings: AdminSettings) => void;
  updateSettings: (input: UpdateSettingsInput) => void;
  updatePlan: (plan: AdminPlan, expiresAt?: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set, get) => ({
      settings: null,
      isLoading: false,

      setSettings: (settings) => set({ settings }),

      updateSettings: (input) => {
        const current = get().settings;
        if (!current) return;
        set({ settings: { ...current, ...input } });
      },

      updatePlan: (plan, expiresAt) => {
        const current = get().settings;
        if (!current) return;
        set({ settings: { ...current, currentPlan: plan, planExpiresAt: expiresAt } });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'emarketpro-admin-settings' }
  )
);
