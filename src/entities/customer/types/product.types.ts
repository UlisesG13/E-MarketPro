// ─────────────────────────────────────────────────────────
// PRODUCT TYPES (Customer view — public)
// ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'draft' | 'archived';
  sku: string;
  rating: number;
  reviews: number;
  createdAt: string;
  storeId?: string;
  storeName?: string;
}
