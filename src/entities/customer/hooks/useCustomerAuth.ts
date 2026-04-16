import { useCallback } from 'react';
import { useCustomerAuthStore } from '../store/customerAuthStore';
import { useCustomerProfileStore } from '../store/customerProfileStore';
import { customerAuthService } from '../services/customerAuthService';
import type { CustomerLoginInput } from '../services/customerAuthService';
import type { CustomerRegisterInput } from '../types/customer.types';

export function useCustomerAuth() {
  const { user, token, isAuthenticated, login, logout } = useCustomerAuthStore();
  const { updateProfile, resetProfile } = useCustomerProfileStore();

  const signIn = useCallback(
    async (input: CustomerLoginInput) => {
      const response = await customerAuthService.login(input);
      login(response.customer, response.token);
      // Preload profile info
      updateProfile({
        fullName: response.customer.name,
        email: response.customer.email,
      });
      return response;
    },
    [login, updateProfile]
  );

  const signUp = useCallback(
    async (input: CustomerRegisterInput) => {
      const response = await customerAuthService.register(input);
      login(response.customer, response.token);
      updateProfile({
        fullName: response.customer.name,
        email: response.customer.email,
      });
      return response;
    },
    [login, updateProfile]
  );

  const signOut = useCallback(async () => {
    try {
      await customerAuthService.logout();
    } catch {
      // Always clear local state even if API call fails
    } finally {
      logout();
      resetProfile();
    }
  }, [logout, resetProfile]);

  return {
    user,
    token,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
