import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerOrder } from '../types/order.types';
import type { CartItem } from '../types/cart.types';
import type { CustomerAddress } from '../types/customer.types';
import { useNotificationsStore } from '../../../shared/store/notificationsStore';
import { customerOrderService } from '../services/customerOrderService';

interface PlaceOrderInput {
  items: CartItem[];
  shippingAddress: CustomerAddress;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  storeId?: string;
  storeName?: string;
}

interface CustomerOrdersState {
  orders: CustomerOrder[];
  lastOrderId: string | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (input: PlaceOrderInput) => Promise<CustomerOrder>;
  setLastOrderId: (orderId: string | null) => void;
  getOrderById: (orderId: string) => CustomerOrder | undefined;
  clearOrders: () => void;
}

function buildAddressLabel(address: CustomerAddress) {
  return `${address.street}, ${address.city}, ${address.state}, CP ${address.zipCode}`;
}

function buildTrackingCode() {
  return `TRK-${String(Date.now()).slice(-8)}`;
}

function resolveAddressId(address: CustomerAddress): string {
  if (address.backendAddressId && address.backendAddressId > 0) {
    return String(address.backendAddressId);
  }
  return address.id;
}

export const useCustomerOrdersStore = create<CustomerOrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: null,
      isLoading: false,

      fetchOrders: async () => {
        set({ isLoading: true });
        try {
          const orders = await customerOrderService.list();
          set({ orders, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      placeOrder: async ({ items, shippingAddress, shippingMethod, shippingCost, paymentMethod, storeId = '', storeName = '' }) => {
        const createdOrder = await customerOrderService.create({
          items,
          shippingAddressId: resolveAddressId(shippingAddress),
          shippingMethod,
          shippingCost,
          paymentMethod,
          storeId,
          storeName,
        });

        const mergedOrder: CustomerOrder = {
          ...createdOrder,
          shippingAddress: createdOrder.shippingAddress || buildAddressLabel(shippingAddress),
          paymentMethod: paymentMethod || createdOrder.paymentMethod,
          shippingMethod: shippingMethod || createdOrder.shippingMethod,
          shippingCost,
          trackingCode: createdOrder.trackingCode ?? buildTrackingCode(),
        };

        set({
          orders: [mergedOrder, ...get().orders],
          lastOrderId: mergedOrder.id,
        });

        useNotificationsStore.getState().pushNotification({
          id: `notif-order-${mergedOrder.id}`,
          title: 'Pedido confirmado',
          description: `${mergedOrder.id} fue registrado correctamente.`,
          time: 'Ahora',
          href: '/account/orders',
          kind: 'order',
        });

        return mergedOrder;
      },

      setLastOrderId: (orderId) => set({ lastOrderId: orderId }),

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      clearOrders: () => set({ orders: [], lastOrderId: null, isLoading: false }),
    }),
    {
      name: 'emarketpro-customer-orders',
      partialize: (state) => ({
        orders: state.orders,
        lastOrderId: state.lastOrderId,
      }),
    }
  )
);
