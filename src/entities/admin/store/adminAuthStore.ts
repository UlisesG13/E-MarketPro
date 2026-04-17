import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenMemory, setRefreshToken, clearRefreshToken } from '@/shared/services/apiClient';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  is_active: boolean;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  plan_id: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  theme_primary_color: string;
  subscription_status: string;
  stripe_charges_enabled: boolean;
}

interface AdminAuthState {
  admin: AdminUser | null;
  store: Store | null;
  isAuthenticated: boolean;
  setAuth: (admin: AdminUser, store: Store, accessToken: string, refreshToken: string) => void;
  updateStore: (store: Partial<Store>) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      store: null,
      isAuthenticated: false,

      setAuth: (admin, store, accessToken, refreshToken) => {
        tokenMemory.setAdminToken(accessToken);
        setRefreshToken('admin', refreshToken);
        set({ admin, store, isAuthenticated: true });
      },

      updateStore: (storeUpdate) =>
        set((state) => ({
          store: state.store ? { ...state.store, ...storeUpdate } : null,
        })),

      logout: () => {
        tokenMemory.clearAdminToken();
        clearRefreshToken('admin');
        set({ admin: null, store: null, isAuthenticated: false });
      },
    }),
    {
      name: 'emarketpro-admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        store: state.store,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
