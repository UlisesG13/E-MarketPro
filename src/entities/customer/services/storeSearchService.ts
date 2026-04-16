import { apiClient } from '../../../shared/services/apiClient';
import type { Product } from '../types/product.types';

export interface StorePublic {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  category?: string;
  productCount: number;
  rating?: number;
}

export interface SearchProductsParams {
  q?: string;
  category?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const storeSearchService = {
  /**
   * List all public stores.
   * GET /stores
   */
  listStores: (): Promise<StorePublic[]> =>
    apiClient.get<StorePublic[]>('/stores', 'public'),

  /**
   * Get products from a specific store.
   * GET /stores/:storeId/products
   */
  getStoreProducts: (storeId: string): Promise<Product[]> =>
    apiClient.get<Product[]>(`/stores/${storeId}/products`, 'public'),

  /**
   * Get a single product by ID.
   * GET /products/:id
   */
  getProductById: (id: string): Promise<Product> =>
    apiClient.get<Product>(`/products/${id}`, 'public'),

  /**
   * Search products across all stores.
   * GET /search/products?q=xxx&category=xxx
   */
  searchProducts: (params: SearchProductsParams): Promise<Product[]> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    return apiClient.get<Product[]>(`/search/products?${query.toString()}`, 'public');
  },

  /**
   * List product categories.
   * GET /categories
   */
  listCategories: (): Promise<{ slug: string; name: string; count: number }[]> =>
    apiClient.get<{ slug: string; name: string; count: number }[]>('/categories', 'public'),
};
