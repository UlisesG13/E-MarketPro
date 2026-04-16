import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CartItem,
  CustomerAddress,
  CustomerPreferences,
  CustomerProfile,
  StoreOrder,
} from '../types';

interface PlaceOrderInput {
  items: CartItem[];
  shippingAddress: CustomerAddress;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
}

interface CustomerState {
  profile: CustomerProfile;
  addresses: CustomerAddress[];
  preferences: CustomerPreferences;
  storeOrders: StoreOrder[];
  lastOrderId: string | null;
  updateProfile: (data: Partial<CustomerProfile>) => void;
  savePreferences: (data: Partial<CustomerPreferences>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateAddress: (id: string, data: Partial<CustomerAddress>) => void;
  removeAddress: (id: string) => void;
  placeOrder: (input: PlaceOrderInput) => StoreOrder;
  setLastOrderId: (orderId: string | null) => void;
  getOrderById: (orderId: string) => StoreOrder | undefined;
}

const DEFAULT_PROFILE: CustomerProfile = {
  fullName: 'Cliente Demo',
  email: 'cliente@emarketpro.mx',
  phone: '+52 961 000 0000',
};

const DEFAULT_ADDRESSES: CustomerAddress[] = [
  {
    id: 'address-default',
    label: 'Casa',
    recipient: 'Cliente Demo',
    phone: '+52 961 000 0000',
    street: 'Av. Central 245, Col. Centro',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    zipCode: '29000',
    references: 'Frente al parque central',
    isDefault: true,
  },
];

const DEFAULT_PREFERENCES: CustomerPreferences = {
  marketingEmails: true,
  orderUpdates: true,
  savedCards: false,
};

function buildAddressLabel(address: CustomerAddress) {
  return `${address.street}, ${address.city}, ${address.state}, CP ${address.zipCode}`;
}

function buildTrackingCode() {
  return `TRK-${String(Date.now()).slice(-8)}`;
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      addresses: DEFAULT_ADDRESSES,
      preferences: DEFAULT_PREFERENCES,
      storeOrders: [],
      lastOrderId: null,
      updateProfile: (data) => {
        set({ profile: { ...get().profile, ...data } });
      },
      savePreferences: (data) => {
        set({ preferences: { ...get().preferences, ...data } });
      },
      addAddress: (address) => {
        const normalizedAddress: CustomerAddress = {
          ...address,
          id: generateId('addr'),
        };

        const hasDefault = get().addresses.some((item) => item.isDefault);
        const nextAddress =
          normalizedAddress.isDefault || !hasDefault
            ? { ...normalizedAddress, isDefault: true }
            : normalizedAddress;

        set({
          addresses: get().addresses
            .map((item) =>
              nextAddress.isDefault ? { ...item, isDefault: false } : item
            )
            .concat(nextAddress),
        });
      },
      updateAddress: (id, data) => {
        set({
          addresses: get().addresses.map((address) => {
            if (address.id === id) {
              return { ...address, ...data };
            }

            if (data.isDefault) {
              return { ...address, isDefault: false };
            }

            return address;
          }),
        });
      },
      removeAddress: (id) => {
        const remaining = get().addresses.filter((address) => address.id !== id);
        if (remaining.length > 0 && !remaining.some((address) => address.isDefault)) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        set({ addresses: remaining });
      },
      placeOrder: ({ items, shippingAddress, shippingMethod, shippingCost, paymentMethod }) => {
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const orderItems = items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }));

        const order: StoreOrder = {
          id: `ORD-${String(Date.now()).slice(-8)}`,
          customerName: get().profile.fullName,
          customerEmail: get().profile.email,
          items: orderItems,
          total: subtotal + shippingCost,
          status: 'processing',
          date: new Date().toISOString(),
          shippingAddress: buildAddressLabel(shippingAddress),
          paymentMethod,
          shippingMethod,
          shippingCost,
          trackingCode: buildTrackingCode(),
        };

        set({
          storeOrders: [order, ...get().storeOrders],
          lastOrderId: order.id,
        });

        return order;
      },
      setLastOrderId: (orderId) => set({ lastOrderId: orderId }),
      getOrderById: (orderId) =>
        get().storeOrders.find((order) => order.id === orderId),
    }),
    { name: 'emarketpro-customer' }
  )
);
