import { apiClient } from '../../../shared/services/apiClient';
import type { Product, CreateProductInput, UpdateProductInput } from '../types/products.types';

export const productService = {
  /**
   * List all products for the admin's store.
   * GET /admin/products
   */
  list: (): Promise<Product[]> =>
    apiClient.get<Product[]>('/admin/products', 'admin'),

  /**
   * Get a single product by ID.
   * GET /admin/products/:id
   */
  getById: (id: string): Promise<Product> =>
    apiClient.get<Product>(`/admin/products/${id}`, 'admin'),

  /**
   * Create a new product.
   * POST /admin/products
   */
  create: (input: CreateProductInput): Promise<Product> =>
    apiClient.post<Product>('/admin/products', input, 'admin'),

  /**
   * Update an existing product.
   * PUT /admin/products/:id
   */
  update: (id: string, input: UpdateProductInput): Promise<Product> =>
    apiClient.put<Product>(`/admin/products/${id}`, input, 'admin'),

  /**
   * Delete a product.
   * DELETE /admin/products/:id
   */
  remove: (id: string): Promise<void> =>
    apiClient.delete<void>(`/admin/products/${id}`, 'admin'),
};
