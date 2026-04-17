import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types/common.types';
import { storeSearchService } from '@/entities/customer/services/storeSearchService';

export function useProducts() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ['storefront-products'],
    queryFn: () => storeSearchService.getStoreProducts('default'),
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data ?? [],
    isLoading,
    error,
  };
}

export function useCreateProduct() {
  return { mutate: (_input: unknown) => {}, isLoading: false };
}
export function useUpdateProduct() {
  return { mutate: (_input: unknown) => {}, isLoading: false };
}
export function useDeleteProduct() {
  return { mutate: (_id: string) => {}, isLoading: false };
}