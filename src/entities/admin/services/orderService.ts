import { apiClient } from '../../../shared/services/apiClient';
import type { AdminOrder, UpdateOrderStatusInput } from '../types/orders.types';

export const orderService = {
  /**
   * Get all orders for the admin's store.
   * GET /admin/orders
   */
  list: (): Promise<AdminOrder[]> =>
    apiClient.get<AdminOrder[]>('/admin/orders', 'admin'),

  /**
   * Get a single order by ID.
   * GET /admin/orders/:id
   */
  getById: (id: string): Promise<AdminOrder> =>
    apiClient.get<AdminOrder>(`/admin/orders/${id}`, 'admin'),

  /**
   * Update the status of an order.
   * PUT /admin/orders/:id/status
   */
  updateStatus: (id: string, input: UpdateOrderStatusInput): Promise<AdminOrder> =>
    apiClient.put<AdminOrder>(`/admin/orders/${id}/status`, input, 'admin'),
};
