import { apiClient } from '../../../shared/services/apiClient';

export interface AddItemRequest {
  producto_id: string;
  color_id: number;
  talla_id: number;
  cantidad: number;
}

export interface UpdateItemQuantityRequest {
  cantidad: number;
}

export interface CarritoItemResponse {
  carrito_item_id: number;
  producto_id: string;
  color_id: number;
  talla_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CarritoResponse {
  carrito_id: string;
  usuario_id: string;
  items: CarritoItemResponse[];
  total: number;
  fecha_actualizacion: string;
}

const CART_RESOURCE_PATH = '/carritos';

export const cartService = {
  addItem: (payload: AddItemRequest): Promise<CarritoResponse> =>
    apiClient.post<CarritoResponse>(CART_RESOURCE_PATH, payload, 'customer', 'products'),

  getCart: (): Promise<CarritoResponse> =>
    apiClient.get<CarritoResponse>(CART_RESOURCE_PATH, 'customer', 'products'),

  removeItem: (itemId: number): Promise<void> =>
    apiClient.delete<void>(`${CART_RESOURCE_PATH}/items/${itemId}`, 'customer', 'products'),

  updateItemQuantity: (itemId: number, payload: UpdateItemQuantityRequest): Promise<CarritoResponse> =>
    apiClient.patch<CarritoResponse>(`${CART_RESOURCE_PATH}/items/${itemId}`, payload, 'customer', 'products'),

  deleteCart: (cartId: string): Promise<void> =>
    apiClient.delete<void>(`${CART_RESOURCE_PATH}/${cartId}`, 'customer', 'products'),
};
