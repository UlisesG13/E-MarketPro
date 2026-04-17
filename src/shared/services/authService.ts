import { apiClient, getRefreshToken } from './apiClient';

// ─── Backend DTOs ──────────────────────────────────────────

export interface UserRegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  usuario_id: string;
  nombre: string;
  email: string;
  fecha_creacion: string;
  telefono?: string;
  rol?: string;
  is_authenticated?: boolean;
  google_id?: string;
  fecha_eliminacion?: string;
}

export interface LoginResponseDTO {
  token: string; // access token
  usuario_id: string;
  email: string;
  rol: string;
  refresh_token?: string; // might come in response or header
}

export interface AuthTokenResponse extends LoginResponseDTO {
  access_token?: string; // alternative field name
  refresh_token: string; // guaranteed in response for setup
}

export interface AuthenticatedUser {
  usuario_id: string;
  email: string;
  rol: string;
}

export interface RecoveryRequestInput {
  email: string;
}

export interface VerifyRecoveryInput {
  usuario_id: string;
  code: string;
}

export interface ResetPasswordInput {
  usuario_id: string;
  new_password: string;
}

// ─── Service (generic auth endpoints) ──────────────────────────────────

export const authService = {
  /**
   * POST /auth/register — register on products backend
   * Register new user (customer or admin based on backend logic)
   */
  register: (data: UserRegisterInput): Promise<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>('/auth/register', data, 'public', 'products'),

  /**
   * POST /auth/login — login on products backend
   * Login user and return token + metadata
   */
  login: (data: UserLoginInput): Promise<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>('/auth/login', data, 'public', 'products'),

  /**
   * GET /auth/me — get user from products backend
   * Get current authenticated user info
   */
  getCurrentUser: (role: 'admin' | 'customer'): Promise<AuthenticatedUser> =>
    apiClient.get<AuthenticatedUser>('/auth/me', role, 'products'),

  /**
   * POST /auth/logout — logout on products backend
   * Logout and invalidate refresh token
   */
  logout: (role: 'admin' | 'customer'): Promise<void> =>
    apiClient.post<void>(
      '/auth/logout',
      { refresh_token: getRefreshToken(role) ?? '' },
      role,
      'products'
    ),

  /**
   * POST /auth/recovery/request — on products backend
   * Request password recovery code (sends email)
   */
  requestRecovery: (email: string): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>('/auth/recovery/request', { email }, 'public', 'products'),

  /**
   * POST /auth/recovery/verify — on products backend
   * Verify recovery code is valid
   */
  verifyRecoveryCode: (data: VerifyRecoveryInput): Promise<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>('/auth/recovery/verify', data, 'public', 'products'),

  /**
   * POST /auth/recovery/reset — on products backend
   * Reset password with recovery code
   */
  resetPassword: (data: ResetPasswordInput): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>('/auth/recovery/reset', data, 'public', 'products'),

  // Google OAuth (placeholder - implement when needed)
  // getGoogleAuthUrl: (): Promise<{ url: string }> =>
  //   apiClient.get<{ url: string }>('/auth/google/login'),
  //
  // loginWithGoogle: (code: string): Promise<LoginResponseDTO> =>
  //   apiClient.post<LoginResponseDTO>('/auth/google/callback', { code }),
};
