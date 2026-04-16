import { apiClient } from '../../../shared/services/apiClient';
import type { AdminUser, Store, AdminLoginResponse } from '../types/admin.types';

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminRegisterInput {
  name: string;
  email: string;
  password: string;
  storeName: string;
  phone?: string;
}

export const adminAuthService = {
  /**
   * Login for admin/seller role.
   * POST /auth/admin/login
   */
  login: (input: AdminLoginInput): Promise<AdminLoginResponse> =>
    apiClient.post<AdminLoginResponse>('/auth/admin/login', input, 'public'),

  /**
   * Logout admin from server (invalidate token).
   * POST /auth/admin/logout
   */
  logout: (): Promise<void> =>
    apiClient.post<void>('/auth/admin/logout', {}, 'admin'),

  /**
   * Register a new admin/store.
   * POST /auth/admin/register
   */
  register: (input: AdminRegisterInput): Promise<AdminLoginResponse> =>
    apiClient.post<AdminLoginResponse>('/auth/admin/register', input, 'public'),

  /**
   * Get current admin profile.
   * GET /auth/admin/me
   */
  me: (): Promise<{ admin: AdminUser; store: Store }> =>
    apiClient.get<{ admin: AdminUser; store: Store }>('/auth/admin/me', 'admin'),
};
