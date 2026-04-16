import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_USER: AuthUser = {
  id: '1',
  name: 'Ulises Gutiérrez',
  email: 'demo@emarketpro.mx',
  avatar: '',
  role: 'Administrador',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (normalizedEmail === 'demo@emarketpro.mx' && normalizedPassword === 'demo123') {
          set({ user: DEMO_USER, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'emarketpro-auth' }
  )
);
