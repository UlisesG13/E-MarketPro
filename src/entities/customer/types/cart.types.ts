// ─────────────────────────────────────────────────────────
// CART TYPES
// ─────────────────────────────────────────────────────────

import type { Product } from '../types/product.types';


export interface CartItem {
  cartItemId?: number;
  storeId: string;
  storeName: string;
  product: Product;
  quantity: number;
  colorId?: number;
  tallaId?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
}
