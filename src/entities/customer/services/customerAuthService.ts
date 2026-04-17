import { authService, type UserLoginInput, type UserRegisterInput, type LoginResponseDTO } from '@/shared/services/authService';

export interface CustomerRegisterInput extends UserRegisterInput {}

export interface CustomerLoginInput extends UserLoginInput {}

export const customerAuthService = {
  /**
   * POST /auth/register — register customer user (delegated to authService, uses products backend)
   */
  register: (data: CustomerRegisterInput): Promise<LoginResponseDTO> =>
    authService.register(data),

  /**
   * POST /auth/login — login customer user
   */
  login: (data: CustomerLoginInput): Promise<LoginResponseDTO> =>
    authService.login(data),

  /**
   * GET /auth/me — get current customer info
   */
  getCurrentUser: (): Promise<{ usuario_id: string; email: string; rol: string }> =>
    authService.getCurrentUser('customer'),

  /**
   * POST /auth/logout — logout customer
   */
  logout: (): Promise<void> =>
    authService.logout('customer'),
};
