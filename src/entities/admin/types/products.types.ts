// ─────────────────────────────────────────────────────────
// ADMIN PRODUCTS TYPES
// ─────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductVisibility = 'hidden' | 'draft' | 'published';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  image: string;
  status: ProductStatus;
  sku: string;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface ProductAnalytics {
  views: number;
  orders: number;
  revenue: number;
}

export interface AdminProduct extends Product {
  visibility: ProductVisibility;
  analytics: ProductAnalytics;
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviews'>;
export type UpdateProductInput = Partial<CreateProductInput>;
