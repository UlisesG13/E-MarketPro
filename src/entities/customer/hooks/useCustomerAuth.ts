import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCustomerAuthStore } from '../store/customerAuthStore';
import { customerAuthService } from '../services/customerAuthService';
import type { CustomerLoginInput, CustomerRegisterInput } from '../services/customerAuthService';
import type { LoginResponseDTO } from '@/shared/services/authService';
import { ApiError } from '@/shared/services/apiClient';

export function useCustomerAuth() {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore, isAuthenticated, customer } = useCustomerAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: CustomerLoginInput) => customerAuthService.login(data),
    onSuccess: (response: LoginResponseDTO) => {
      // Map backend response to customer store structure
      const customerData = {
        id: response.usuario_id,
        email: response.email,
        name: response.email.split('@')[0], // fallback name from email
        phone: null,
        avatar: null,
      };
      const refreshToken = response.refresh_token || '';
      setAuth(customerData, response.token, refreshToken);
      toast.success(`Bienvenido, ${response.email}`);
      navigate('/store');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al iniciar sesión';
      toast.error(detail);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: CustomerRegisterInput) => customerAuthService.register(data),
    onSuccess: (response: LoginResponseDTO) => {
      // Map backend response to customer store structure
      const customerData = {
        id: response.usuario_id,
        email: response.email,
        name: response.email.split('@')[0],
        phone: null,
        avatar: null,
      };
      const refreshToken = response.refresh_token || '';
      setAuth(customerData, response.token, refreshToken);
      toast.success('Cuenta creada exitosamente');
      navigate('/store');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al crear la cuenta';
      toast.error(detail);
    },
  });

  const logout = async () => {
    try {
      await customerAuthService.logout();
    } catch { /* always clear local state */ }
    logoutStore();
    navigate('/login');
  };

  return {
    isAuthenticated,
    customer,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
