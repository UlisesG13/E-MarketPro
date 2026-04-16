import { useCallback } from 'react';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { useStoreStore } from '../store/storeStore';
import { adminAuthService } from '../services/adminAuthService';
import type { AdminLoginInput } from '../services/adminAuthService';

export function useAdminAuth() {
  const { user, store, token, isAuthenticated, login, logout } = useAdminAuthStore();
  const { setStore } = useStoreStore();

  const signIn = useCallback(
    async (input: AdminLoginInput) => {
      const response = await adminAuthService.login(input);
      login(response.admin, response.store, response.token);
      setStore(response.store);
      return response;
    },
    [login, setStore]
  );

  const signOut = useCallback(async () => {
    try {
      await adminAuthService.logout();
    } catch {
      // Ignore server error on logout - always clear local state
    } finally {
      logout();
    }
  }, [logout]);

  return {
    user,
    store,
    token,
    isAuthenticated,
    signIn,
    signOut,
    currentPlan: user?.plan ?? 'free',
  };
}
