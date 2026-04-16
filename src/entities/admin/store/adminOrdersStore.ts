import { create } from 'zustand';
import type { AdminOrder, OrderStatus, UpdateOrderStatusInput } from '../types/orders.types';

interface AdminOrdersState {
  orders: AdminOrder[];
  isLoading: boolean;
  error: string | null;
  setOrders: (orders: AdminOrder[]) => void;
  updateOrderStatus: (id: string, input: UpdateOrderStatusInput) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getOrderById: (id: string) => AdminOrder | undefined;
  getOrdersByStatus: (status: OrderStatus) => AdminOrder[];
}

export const useAdminOrdersStore = create<AdminOrdersState>()((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  updateOrderStatus: (id, input) =>
    set({
      orders: get().orders.map((o) =>
        o.id === id ? { ...o, ...input } : o
      ),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),
}));
