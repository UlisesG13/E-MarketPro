import { apiClient } from '../../../shared/services/apiClient';
import type { Product } from '../types/product.types';

export interface StorePublic {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  category?: string;
  productCount: number;
  rating?: number;
}

export interface SearchProductsParams {
  q?: string;
  category?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// ─── Backend DTOs ─────────────────────────────────────────

interface BackendProducto {
  producto_id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  esta_activo: boolean;
  esta_destacado: boolean;
  categoria_id: number;
  fecha_creacion: string;
}

interface BackendCategoria {
  categoria_id: number;
  nombre: string;
  seccion_id: number;
}

// ─── Adapter ─────────────────────────────────────────────

function adaptProduct(p: BackendProducto): Product {
  return {
    id: p.producto_id,
    name: p.nombre,
    description: p.descripcion ?? '',
    price: p.precio,
    category: String(p.categoria_id),
    stock: 0,
    image: '',
    status: p.esta_activo ? 'active' : 'archived',
    sku: p.producto_id,
    rating: 0,
    reviews: 0,
    createdAt: p.fecha_creacion,
  };
}

// ─── Service ─────────────────────────────────────────────

export const storeSearchService = {
  /**
   * Backend has no multi-store concept — returns a single virtual store.
   * GET /productos/ to get product count.
   */
  listStores: async (): Promise<StorePublic[]> => {
    const productos = await apiClient.get<BackendProducto[]>('/productos/', 'public').catch(() => []);
    return [{
      id: 'default',
      name: 'Golazo Store',
      description: 'Tienda principal',
      productCount: productos.length,
    }];
  },

  /**
   * GET /productos/  (filtered by category when storeId maps to one)
   */
  getStoreProducts: async (storeId: string): Promise<Product[]> => {
    void storeId;
    const data = await apiClient.get<BackendProducto[]>('/productos/', 'public');
    return data.filter((p) => p.esta_activo).map(adaptProduct);
  },

  /**
   * GET /productos/:id/
   */
  getProductById: async (id: string): Promise<Product> => {
    const data = await apiClient.get<BackendProducto>(`/productos/${id}/`, 'public');
    return adaptProduct(data);
  },

  /**
   * Search by name (client-side filter) or by category ID.
   * GET /productos/by-categoria/:id/ when category is provided.
   */
  searchProducts: async (params: SearchProductsParams): Promise<Product[]> => {
    let data: BackendProducto[];

    if (params.category) {
      data = await apiClient.get<BackendProducto[]>(
        `/productos/by-categoria/${params.category}/`,
        'public'
      ).catch(() => []);
    } else {
      data = await apiClient.get<BackendProducto[]>('/productos/', 'public').catch(() => []);
    }

    let results = data.filter((p) => p.esta_activo);

    if (params.q) {
      const q = params.q.toLowerCase();
      results = results.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    if (params.minPrice !== undefined) results = results.filter((p) => p.precio >= params.minPrice!);
    if (params.maxPrice !== undefined) results = results.filter((p) => p.precio <= params.maxPrice!);

    return results.map(adaptProduct);
  },

  /**
   * GET /categorias/
   */
  listCategories: async (): Promise<{ slug: string; name: string; count: number }[]> => {
    const data = await apiClient.get<BackendCategoria[]>('/categorias/', 'public').catch(() => []);
    return data.map((c) => ({
      slug: String(c.categoria_id),
      name: c.nombre,
      count: 0,
    }));
  },
};
