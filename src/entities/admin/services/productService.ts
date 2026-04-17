import { apiClient } from '@/shared/services/apiClient';

// ─── Backend DTOs (from ProductoDTO) ──────────────────────
export interface ProductoDTO {
  producto_id: string;
  nombre: string;
  precio?: number | null;
  descripcion?: string;
  esta_activo: boolean;
  esta_destacado: boolean;
  categoria_id?: number;
  fecha_creacion: string;
  imagenes?: Array<{ url?: string }>;
  tallas?: unknown[];
  colores?: unknown[];
}

export interface ProductoCreateDTO {
  nombre: string;
  precio: number;
  descripcion?: string;
  esta_activo: boolean;
  esta_destacado: boolean;
  categoria_id: number;
}

export interface ProductoUpdateDTO extends Partial<ProductoCreateDTO> {}

// ─── Frontend form type (for component compatibility) ──────────────────────
export interface CreateProductInput {
  nombre: string;
  precio: number;
  descripcion?: string;
  esta_activo: boolean;
  esta_destacado: boolean;
  categoria_id: number;
}

// ─── Service (queries VITE_STORE_API_URL backend) ──────────────────────

const PRODUCTS_RESOURCE_PATH = '/productos';

export const productService = {
  /**
   * GET /productos — list all productos
   */
  getAll: (): Promise<ProductoDTO[]> =>
    apiClient.get<ProductoDTO[]>(PRODUCTS_RESOURCE_PATH, 'admin', 'products'),

  /**
   * GET /productos/{producto_id}
   */
  getById: (id: string): Promise<ProductoDTO> =>
    apiClient.get<ProductoDTO>(`${PRODUCTS_RESOURCE_PATH}/${id}`, 'admin', 'products'),

  /**
   * POST /productos — create new producto
   */
  create: (data: ProductoCreateDTO): Promise<ProductoDTO> =>
    apiClient.post<ProductoDTO>(PRODUCTS_RESOURCE_PATH, data, 'admin', 'products'),

  /**
   * PUT /productos/{producto_id} — update producto
   */
  update: (id: string, data: ProductoUpdateDTO): Promise<ProductoDTO> =>
    apiClient.put<ProductoDTO>(`${PRODUCTS_RESOURCE_PATH}/${id}`, data, 'admin', 'products'),

  /**
   * PUT /productos/{producto_id}/alter-status — toggle active status
   */
  updateStatus: (id: string, status: boolean): Promise<ProductoDTO> =>
    apiClient.put<ProductoDTO>(
      `${PRODUCTS_RESOURCE_PATH}/${id}/alter-status`,
      { status },
      'admin',
      'products'
    ),

  /**
   * PUT /productos/{producto_id}/alter-destacado — toggle highlighted status
   */
  updateHighlighted: (id: string, destacado: boolean): Promise<ProductoDTO> =>
    apiClient.put<ProductoDTO>(
      `${PRODUCTS_RESOURCE_PATH}/${id}/alter-destacado`,
      { destacado },
      'admin',
      'products'
    ),

  /**
   * DELETE /productos/{producto_id}
   */
  delete: (id: string): Promise<void> =>
    apiClient.delete<void>(`${PRODUCTS_RESOURCE_PATH}/${id}`, 'admin', 'products'),

  /**
   * GET /productos/by-categoria/{categoria_id} — list productos by category
   */
  getByCategory: (categoryId: number): Promise<ProductoDTO[]> =>
    apiClient.get<ProductoDTO[]>(`${PRODUCTS_RESOURCE_PATH}/by-categoria/${categoryId}`, 'admin', 'products'),
};
