import { apiClient } from '@/shared/services/apiClient';

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyOrder = any;

export const adminOrderService = {
  getAll: (filters: OrderFilters = {}) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined) params.set(k, String(v));
    }
    const q = params.toString();
    return apiClient.get<{ items: AnyOrder[]; total: number; page: number; limit: number }>(
      `/orders${q ? `?${q}` : ''}`,
      'admin'
    );
  },

  getById: (id: string) =>
    apiClient.get<AnyOrder>(`/orders/${id}`, 'admin'),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<AnyOrder>(`/orders/${id}/status`, { status }, 'admin'),

  getSummary: () =>
    apiClient.get<AnyOrder>('/orders/stats/summary', 'admin'),
};
