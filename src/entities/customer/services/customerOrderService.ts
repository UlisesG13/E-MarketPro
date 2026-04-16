import { apiClient } from '../../../shared/services/apiClient';
import type { CustomerOrder, PlaceOrderInput } from '../types/order.types';

export const customerOrderService = {
  /**
   * Get the customer's order history.
   * GET /customer/orders
   */
  list: (): Promise<CustomerOrder[]> =>
    apiClient.get<CustomerOrder[]>('/customer/orders', 'customer'),

  /**
   * Get a single order by ID.
   * GET /customer/orders/:id
   */
  getById: (id: string): Promise<CustomerOrder> =>
    apiClient.get<CustomerOrder>(`/customer/orders/${id}`, 'customer'),

  /**
   * Place a new order.
   * POST /orders
   */
  create: (input: PlaceOrderInput): Promise<CustomerOrder> =>
    apiClient.post<CustomerOrder>('/orders', input, 'customer'),
};
