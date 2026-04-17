import { apiClient, getRefreshToken } from '@/shared/services/apiClient';

export interface CustomerRegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface CustomerLoginInput {
  email: string;
  password: string;
}

interface CustomerAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer: any;
}

export const customerAuthService = {
  register: (data: CustomerRegisterInput) =>
    apiClient.post<CustomerAuthResponse>('/auth/customer/register', data),

  login: (data: CustomerLoginInput) =>
    apiClient.post<CustomerAuthResponse>('/auth/customer/login', data),

  logout: () =>
    apiClient.post<void>('/auth/logout', { refresh_token: getRefreshToken('customer') ?? '' }, 'customer'),
};
