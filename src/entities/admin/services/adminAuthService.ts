import { apiClient } from '@/shared/services/apiClient';
import { authService, type UserLoginInput, type LoginResponseDTO, type UserResponse } from '@/shared/services/authService';

export interface AdminRegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface AdminLoginInput extends UserLoginInput {}

export interface AdminUpdateInput {
  nombre?: string;
  email?: string;
  telefono?: string;
  rol?: string;
}

export const adminAuthService = {
  /**
   * POST /auth/register — self-register as admin/vendor (public, products backend)
   */
  register: (data: AdminRegisterInput): Promise<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>('/auth/register', data, 'public', 'products'),

  /**
   * POST /users/admins — create another admin user (requires admin auth)
   */
  createAdmin: (data: AdminRegisterInput): Promise<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>('/admins', data, 'admin'),

  /**
   * POST /auth/login — login admin user (delegated to authService, uses products backend)
   */
  login: (data: AdminLoginInput): Promise<LoginResponseDTO> =>
    authService.login(data),

  /**
   * GET /auth/me — get current admin info
   */
  getCurrentUser: (): Promise<{ usuario_id: string; email: string; rol: string }> =>
    authService.getCurrentUser('admin'),

  /**
   * GET /users/admins — list all admins (requires admin auth)
   */
  listAdmins: (): Promise<UserResponse[]> =>
    apiClient.get<UserResponse[]>('/admins', 'admin'),

  /**
   * PUT /users/admins/{usuario_id} — update admin user (requires admin auth)
   */
  updateAdmin: (userId: string, data: AdminUpdateInput): Promise<UserResponse> =>
    apiClient.put<UserResponse>(`/admins/${userId}`, data, 'admin'),

  /**
   * DELETE /users/admins/{usuario_id} — delete admin user (requires admin auth)
   */
  deleteAdmin: (userId: string): Promise<void> =>
    apiClient.delete<void>(`/admins/${userId}`, 'admin'),

  /**
   * POST /auth/logout — logout admin
   */
  logout: (): Promise<void> =>
    authService.logout('admin'),
};
