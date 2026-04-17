import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenMemory, setRefreshToken, clearRefreshToken } from '@/shared/services/apiClient';

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
}

interface CustomerAuthState {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  setAuth: (customer: CustomerUser, accessToken: string, refreshToken: string) => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  logout: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,

      setAuth: (customer, accessToken, refreshToken) => {
        tokenMemory.setCustomerToken(accessToken);
        setRefreshToken('customer', refreshToken);
        set({ customer, isAuthenticated: true });
      },

      updateProfile: (data) =>
        set((state) => ({
          customer: state.customer ? { ...state.customer, ...data } : null,
        })),

      logout: () => {
        tokenMemory.clearCustomerToken();
        clearRefreshToken('customer');
        set({ customer: null, isAuthenticated: false });
      },
    }),
    {
      name: 'emarketpro-customer-auth',
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
