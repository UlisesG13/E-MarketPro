import { apiClient } from '../../../shared/services/apiClient';
import { categoryService } from '../../../shared/services/categoryService';
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
  stock?: number | null;
  esta_activo: boolean;
  esta_destacado: boolean;
  categoria_id?: number;
  fecha_creacion: string;
  imagenes?: Array<{ url?: string }>;
}

const PRODUCTS_RESOURCE_PATH = '/productos';

async function getCategoryNameMap(): Promise<Map<number, string>> {
  const categories = await categoryService.getAll().catch(() => []);
  const map = new Map<number, string>();
  categories.forEach((category) => {
    map.set(category.categoria_id, category.name);
  });
  return map;
}

// ─── Adapter ─────────────────────────────────────────────

function adaptProduct(p: BackendProducto, categoryNameMap?: Map<number, string>): Product {
  const primaryImage = p.imagenes?.[0]?.url ?? '';
  const categoryLabel = p.categoria_id != null
    ? (categoryNameMap?.get(p.categoria_id) ?? String(p.categoria_id))
    : 'Sin categoría';
  const rawStock = p.stock;
  const normalizedStock = typeof rawStock === 'number' && rawStock > 0 ? rawStock : 0;

  return {
    id: p.producto_id,
    name: p.nombre,
    description: p.descripcion ?? '',
    price: p.precio,
    category: categoryLabel,
    stock: normalizedStock,
    image: primaryImage,
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
   * GET /productos to list all products for store
   */
  listStores: async (): Promise<StorePublic[]> => {
    const productos = await apiClient.get<BackendProducto[]>(PRODUCTS_RESOURCE_PATH, 'public', 'products').catch(() => []);
    return [{
      id: 'default',
      name: 'Golazo Store',
      description: 'Tienda principal',
      productCount: productos.length,
    }];
  },

  /**
   * GET /productos — list all active products
   */
  getStoreProducts: async (storeId: string): Promise<Product[]> => {
    void storeId;
    const [data, categoryNameMap] = await Promise.all([
      apiClient.get<BackendProducto[]>(PRODUCTS_RESOURCE_PATH, 'public', 'products'),
      getCategoryNameMap(),
    ]);
    return data.filter((p) => p.esta_activo).map((p) => adaptProduct(p, categoryNameMap));
  },

  /**
   * GET /productos/{producto_id}
   */
  getProductById: async (id: string): Promise<Product> => {
    const [data, categoryNameMap] = await Promise.all([
      apiClient.get<BackendProducto>(`${PRODUCTS_RESOURCE_PATH}/${id}`, 'public', 'products'),
      getCategoryNameMap(),
    ]);
    return adaptProduct(data, categoryNameMap);
  },

  /**
   * Search by name (client-side filter) or by category ID.
   * GET /productos/by-categoria/{categoria_id} when category is provided.
   */
  searchProducts: async (params: SearchProductsParams): Promise<Product[]> => {
    let data: BackendProducto[];
    const categoryNameMap = await getCategoryNameMap();

    if (params.category) {
      data = await apiClient.get<BackendProducto[]>(
        `${PRODUCTS_RESOURCE_PATH}/by-categoria/${params.category}`,
        'public',
        'products'
      ).catch(() => []);
    } else {
      data = await apiClient.get<BackendProducto[]>(PRODUCTS_RESOURCE_PATH, 'public', 'products').catch(() => []);
    }

    let results = data.filter((p) => p.esta_activo);

    if (params.q) {
      const q = params.q.toLowerCase();
      results = results.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    if (params.minPrice !== undefined) results = results.filter((p) => p.precio >= params.minPrice!);
    if (params.maxPrice !== undefined) results = results.filter((p) => p.precio <= params.maxPrice!);

    return results.map((p) => adaptProduct(p, categoryNameMap));
  },

  /**
   * GET /categorias — list all categories
   */
  listCategories: async (): Promise<{ slug: string; name: string; count: number }[]> => {
    const data = await categoryService.getAll().catch(() => []);
    return data.map((c) => ({
      slug: String(c.categoria_id),
      name: c.name,
      count: 0,
    }));
  },
};
