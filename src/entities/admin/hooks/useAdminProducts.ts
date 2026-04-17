import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productService } from '../services/productService';
import type { ProductFilters, CreateProductInput } from '../services/productService';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { ApiError } from '@/shared/services/apiClient';

const productKeys = {
  all: (storeId: string) => ['products', storeId] as const,
  filtered: (storeId: string, filters: ProductFilters) => ['products', storeId, filters] as const,
  detail: (storeId: string, id: string) => ['products', storeId, id] as const,
  count: (storeId: string) => ['products', storeId, 'count'] as const,
};

export function useAdminProducts(filters: ProductFilters = {}) {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useQuery({
    queryKey: productKeys.filtered(storeId, filters),
    queryFn: () => productService.getAll(filters),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useProductCount() {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useQuery({
    queryKey: productKeys.count(storeId),
    queryFn: () => productService.getCount(),
    enabled: !!storeId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', storeId] });
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
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductInput> }) =>
      productService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', storeId] });
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
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      toast.success('Producto eliminado');
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.detail : 'Error al eliminar el producto';
      toast.error(detail);
    },
  });
}
