import { apiClient } from './apiClient';

// ─── Backend DTOs ─────────────────────────────────────────

export interface CategoriaDto {
  categoria_id: number;
  name: string;
  seccion_id: number;
}

export interface CategoriaCreate {
  name: string;
  seccion_id: number;
}

export interface CategoriaUpdate extends Partial<CategoriaCreate> {}

// ─── Service (queries VITE_STORE_API_URL/categorias backend) ──────────────────────

export const categoryService = {
  /**
   * GET /categorias — list all categories
   */
  getAll: (): Promise<CategoriaDto[]> =>
    apiClient.get<CategoriaDto[]>('/categorias', 'public', 'products'),

  /**
   * GET /categorias/{categoria_id}
   */
  getById: (id: number): Promise<CategoriaDto> =>
    apiClient.get<CategoriaDto>(`/categorias/${id}`, 'public', 'products'),

  /**
   * GET /categorias/by-seccion/{seccion_id}
   */
  getBySection: (sectionId: number): Promise<CategoriaDto[]> =>
    apiClient.get<CategoriaDto[]>(
      `/categorias/by-seccion/${sectionId}`,
      'public',
      'products'
    ),

  /**
   * POST /categorias — create new category (admin only)
   */
  create: (data: CategoriaCreate): Promise<CategoriaDto> =>
    apiClient.post<CategoriaDto>('/categorias', data, 'admin', 'products'),

  /**
   * PUT /categorias/{categoria_id} — update category (admin only)
   */
  update: (id: number, data: CategoriaUpdate): Promise<CategoriaDto> =>
    apiClient.put<CategoriaDto>(`/categorias/${id}`, data, 'admin', 'products'),

  /**
   * DELETE /categorias/{categoria_id} (admin only)
   */
  delete: (id: number): Promise<void> =>
    apiClient.delete<void>(`/categorias/${id}`, 'admin', 'products'),
};
