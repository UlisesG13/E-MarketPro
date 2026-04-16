// ─────────────────────────────────────────────────────────
// ADMIN ORDERS TYPES
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

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface AdminOrder extends Order {
  notes: string;
  customLabel?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  trackingCode?: string;
  shippingMethod: string;
  shippingCost: number;
}

export type UpdateOrderStatusInput = {
  status: OrderStatus;
  notes?: string;
  trackingCode?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
};
