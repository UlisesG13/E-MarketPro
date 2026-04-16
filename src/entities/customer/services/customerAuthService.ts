import { apiClient } from '../../../shared/services/apiClient';
import type { CustomerUser, CustomerLoginResponse, CustomerRegisterInput } from '../types/customer.types';

export interface CustomerLoginInput {
  email: string;
  password: string;
}

export const customerAuthService = {
  /**
   * Login for customer role.
   * POST /auth/customer/login
   */
  login: (input: CustomerLoginInput): Promise<CustomerLoginResponse> =>
    apiClient.post<CustomerLoginResponse>('/auth/customer/login', input, 'public'),

  /**
   * Logout customer from server.
   * POST /auth/customer/logout
   */
  logout: (): Promise<void> =>
    apiClient.post<void>('/auth/customer/logout', {}, 'customer'),

  /**
   * Register a new customer.
   * POST /auth/customer/register
   */
  register: (input: CustomerRegisterInput): Promise<CustomerLoginResponse> =>
    apiClient.post<CustomerLoginResponse>('/auth/customer/register', input, 'public'),

  /**
   * Get current customer profile.
   * GET /auth/customer/me
   */
  me: (): Promise<CustomerUser> =>
    apiClient.get<CustomerUser>('/auth/customer/me', 'customer'),
};
