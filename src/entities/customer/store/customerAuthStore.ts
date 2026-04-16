import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerUser } from '../types/customer.types';

interface CustomerAuthState {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: CustomerUser, token: string) => void;
  logout: () => void;
  setUser: (user: CustomerUser) => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'emarketpro-customer-auth' }
  )
);
