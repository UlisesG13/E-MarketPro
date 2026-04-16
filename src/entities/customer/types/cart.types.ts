// ─────────────────────────────────────────────────────────
// CART TYPES
// ─────────────────────────────────────────────────────────

import type { Product } from '../types/product.types';


export interface CartItem {
  storeId: string;
  storeName: string;
  product: Product;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
}
