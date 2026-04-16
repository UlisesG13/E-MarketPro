import { create } from 'zustand';
import type { Product, CreateProductInput, UpdateProductInput } from '../types/products.types';

interface AdminProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: UpdateProductInput) => void;
  removeProduct: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useAdminProductsStore = create<AdminProductsState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  addProduct: (product) => set({ products: [product, ...get().products] }),

  updateProduct: (id, data) =>
    set({
      products: get().products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }),

  removeProduct: (id) =>
    set({ products: get().products.filter((p) => p.id !== id) }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getProductById: (id) => get().products.find((p) => p.id === id),
}));

export type { CreateProductInput };
