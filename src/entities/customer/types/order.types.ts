// ─────────────────────────────────────────────────────────
// CUSTOMER ORDER TYPES
// ─────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
  // Store context
  storeId: string;
  storeName: string;
  storeLogo?: string;
  // Shipping details
  shippingMethod: string;
  shippingCost: number;
  trackingCode?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
}

export interface PlaceOrderInput {
  items: import('./cart.types').CartItem[];
  shippingAddressId: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  storeId?: string;
  storeName?: string;
}
