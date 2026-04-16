import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerOrder } from '../types/order.types';
import type { CartItem } from '../types/cart.types';
import type { CustomerAddress } from '../types/customer.types';
import { useNotificationsStore } from '../../../shared/store/notificationsStore';

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
  placeOrder: (input: PlaceOrderInput) => CustomerOrder;
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

export const useCustomerOrdersStore = create<CustomerOrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: null,

      placeOrder: ({ items, shippingAddress, shippingMethod, shippingCost, paymentMethod, storeId = '', storeName = '' }) => {
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const orderItems = items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }));

        const order: CustomerOrder = {
          id: `ORD-${String(Date.now()).slice(-8)}`,
          customerName: shippingAddress.recipient,
          customerEmail: '',
          items: orderItems,
          total: subtotal + shippingCost,
          status: 'processing',
          date: new Date().toISOString(),
          shippingAddress: buildAddressLabel(shippingAddress),
          paymentMethod,
          storeId,
          storeName,
          shippingMethod,
          shippingCost,
          trackingCode: buildTrackingCode(),
        };

        set({
          orders: [order, ...get().orders],
          lastOrderId: order.id,
        });

        useNotificationsStore.getState().pushNotification({
          id: `notif-order-${order.id}`,
          title: 'Pedido confirmado',
          description: `${order.id} fue registrado correctamente.`,
          time: 'Ahora',
          href: '/account/orders',
          kind: 'order',
        });

        return order;
      },

      setLastOrderId: (orderId) => set({ lastOrderId: orderId }),

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      clearOrders: () => set({ orders: [], lastOrderId: null }),
    }),
    { name: 'emarketpro-customer-orders' }
  )
);
