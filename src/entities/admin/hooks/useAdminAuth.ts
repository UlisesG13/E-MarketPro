import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminAuthService } from '../services/adminAuthService';
import type { AdminLoginInput, AdminRegisterInput } from '../services/adminAuthService';
import type { LoginResponseDTO } from '@/shared/services/authService';
import { ApiError } from '@/shared/services/apiClient';

export function useAdminAuth() {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore, isAuthenticated, admin, store } = useAdminAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: AdminLoginInput) => adminAuthService.login(data),
    onSuccess: (response: LoginResponseDTO) => {
      // Map backend response to admin store structure
      const adminData = {
        id: response.usuario_id,
        email: response.email,
        name: response.email.split('@')[0], // fallback name from email
        role: response.rol,
        avatar: null,
        is_active: true,
      };
      const storeData = {
        id: '',
        name: '',
        slug: '',
        plan_id: '',
        logo: null,
        banner: null,
        description: null,
        theme_primary_color: '#000000',
        subscription_status: 'active',
        stripe_charges_enabled: false,
      };
      const refreshToken = response.refresh_token || '';
      setAuth(adminData, storeData, response.token, refreshToken);
      toast.success(`Bienvenido, ${response.email}`);
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al iniciar sesión';
      toast.error(detail);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: AdminRegisterInput) => adminAuthService.register(data),
    onSuccess: (response: LoginResponseDTO) => {
      // Map backend response to admin store structure
      const adminData = {
        id: response.usuario_id,
        email: response.email,
        name: response.email.split('@')[0],
        role: response.rol,
        avatar: null,
        is_active: true,
      };
      const storeData = {
        id: '',
        name: '',
        slug: '',
        plan_id: '',
        logo: null,
        banner: null,
        description: null,
        theme_primary_color: '#000000',
        subscription_status: 'active',
        stripe_charges_enabled: false,
      };
      const refreshToken = response.refresh_token || '';
      setAuth(adminData, storeData, response.token, refreshToken);
      toast.success('Cuenta creada exitosamente');
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al crear la cuenta';
      toast.error(detail);
    },
  });

  const logout = async () => {
    try {
      await adminAuthService.logout();
    } catch { /* always clear local state */ }
    logoutStore();
    navigate('/login');
  };

  return {
    isAuthenticated,
    admin,
    store,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
