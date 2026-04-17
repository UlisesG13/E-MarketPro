import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productService, type ProductoCreateDTO, type ProductoUpdateDTO } from '../services/productService';
import { ApiError } from '@/shared/services/apiClient';

const productKeys = {
  all: () => ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

interface ProductFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export function useAdminProducts(_filters?: ProductFilters) {
  // For now, filters are ignored as backend doesn't support pagination yet
  // This structure allows future backend pagination support
  return useQuery({
    queryKey: productKeys.all(),
    queryFn: () => productService.getAll(),
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductoCreateDTO) => productService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Producto creado exitosamente');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al crear el producto';
      toast.error(detail);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductoUpdateDTO }) =>
      productService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Producto actualizado');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al actualizar el producto';
      toast.error(detail);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Producto eliminado');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al eliminar el producto';
      toast.error(detail);
    },
  });
}
