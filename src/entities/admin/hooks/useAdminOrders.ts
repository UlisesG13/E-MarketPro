import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminOrderService, type OrderFilters } from '../services/orderService';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { ApiError } from '@/shared/services/apiClient';

const orderKeys = {
  all: (storeId: string) => ['orders', storeId] as const,
  filtered: (storeId: string, filters: OrderFilters) =>
    ['orders', storeId, filters] as const,
  detail: (storeId: string, id: string) => ['orders', storeId, id] as const,
};

export function useAdminOrders(filters: OrderFilters = {}) {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useQuery({
    queryKey: orderKeys.filtered(storeId, filters),
    queryFn: () => adminOrderService.getAll(filters),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAdminOrder(orderId: string) {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useQuery({
    queryKey: orderKeys.detail(storeId, orderId),
    queryFn: () => adminOrderService.getById(orderId),
    enabled: !!storeId && !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrderService.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders', storeId] });
      toast.success('Estado de orden actualizado');
    },
    onError: (error: unknown) => {
      const detail =
        error instanceof ApiError ? error.detail : 'Error al actualizar la orden';
      toast.error(detail);
    },
  });
}
