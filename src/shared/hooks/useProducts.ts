import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types/common.types';
import { products } from '../services/mockData';

/**
 * Shared products hook — fetches products from mockData.
 * When connected to the API, this would call storeSearchService.listStores() etc.
 */
export function useProducts() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return products as Product[];
    },
    staleTime: 1000 * 60 * 5,
    initialData: products as Product[],
  });

  return {
    products: data ?? (products as Product[]),
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