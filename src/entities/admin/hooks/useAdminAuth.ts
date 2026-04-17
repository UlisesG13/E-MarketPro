import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { adminAuthService } from '../services/adminAuthService';
import type { AdminLoginInput, AdminRegisterInput } from '../services/adminAuthService';
import { ApiError } from '@/shared/services/apiClient';

export function useAdminAuth() {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore, isAuthenticated, admin, store } = useAdminAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: AdminLoginInput) => adminAuthService.login(data),
    onSuccess: (response) => {
      setAuth(response.admin, response.store, response.access_token, response.refresh_token);
      toast.success(`Bienvenido, ${response.admin.name}`);
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al iniciar sesión';
      toast.error(detail);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: AdminRegisterInput) => adminAuthService.register(data),
    onSuccess: (response) => {
      setAuth(response.admin, response.store, response.access_token, response.refresh_token);
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
