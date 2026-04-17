import { apiClient, getRefreshToken } from '@/shared/services/apiClient';

export interface AdminRegisterInput {
  email: string;
  password: string;
  name: string;
  store_name: string;
  store_slug: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

interface AdminAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any;
}

export const adminAuthService = {
  register: (data: AdminRegisterInput) =>
    apiClient.post<AdminAuthResponse>('/auth/admin/register', data),

  login: (data: AdminLoginInput) =>
    apiClient.post<AdminAuthResponse>('/auth/admin/login', data),

  logout: () =>
    apiClient.post<void>('/auth/logout', { refresh_token: getRefreshToken('admin') ?? '' }, 'admin'),
};
