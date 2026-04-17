import { useCustomerOrdersStore } from '../../entities/customer/store/customerOrdersStore';
import type { CustomerOrder } from '../../entities/customer/types/order.types';

/**
 * Shared orders hook — wraps customer orders store.
 * Admin orders come from useAdminOrdersStore.
 */
export function useOrders() {
  const { orders, placeOrder, lastOrderId, getOrderById, fetchOrders, isLoading } = useCustomerOrdersStore();

  return {
    orders: orders as CustomerOrder[],
    placeOrder,
    lastOrderId,
    getOrderById,
    fetchOrders,
    isLoading,
  };
}
