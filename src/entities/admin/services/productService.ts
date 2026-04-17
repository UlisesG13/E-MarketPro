import { apiClient } from '@/shared/services/apiClient';

export interface ProductFilters {
  page?: number;
  limit?: number;
  status?: 'active' | 'draft' | 'archived';
  category?: string;
  search?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  sku?: string;
  stock: number;
  category?: string;
  status: 'active' | 'draft' | 'archived';
}

function buildQuery(filters: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProduct = any;

export const productService = {
  getAll: (filters: ProductFilters = {}) =>
    apiClient.get<{ items: AnyProduct[]; total: number; page: number; limit: number }>(
      `/products${buildQuery(filters as Record<string, string | number | undefined>)}`,
      'admin'
    ),

  getById: (id: string) =>
    apiClient.get<AnyProduct>(`/products/${id}`, 'admin'),

  getCount: () =>
    apiClient.get<{ total_active: number }>('/products/count', 'admin'),

  create: (data: CreateProductInput) =>
    apiClient.post<AnyProduct>('/products', data, 'admin'),

  update: (id: string, data: Partial<CreateProductInput>) =>
    apiClient.put<AnyProduct>(`/products/${id}`, data, 'admin'),

  updateStatus: (id: string, status: 'active' | 'draft' | 'archived') =>
    apiClient.patch<AnyProduct>(`/products/${id}/status`, { status }, 'admin'),

  delete: (id: string) =>
    apiClient.delete<void>(`/products/${id}`, 'admin'),
};
