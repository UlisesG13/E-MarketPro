import { apiClient } from '../../../shared/services/apiClient';
import type { CustomerOrder, PlaceOrderInput } from '../types/order.types';
import { useCustomerAuthStore } from '../store/customerAuthStore';

// ─── Backend DTOs ─────────────────────────────────────────

interface CreatePedidoDTO {
  direccion_id: number;
  promocion?: string | null;
  notas?: string | null;
}

interface PedidoItemDTO {
  producto_id: string;
  nombre_producto: string;
  color_id: number | null;
  talla_id: number | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface PedidoDTO {
  pedido_id: number;
  usuario_id: string;
  estado: string;
  fecha_pedido: string;
  subtotal: number;
  descuento: number;
  total: number;
  direccion: Record<string, unknown>;
  items: PedidoItemDTO[];
  notas?: string | null;
}

// ─── Adapter ─────────────────────────────────────────────

function mapEstado(estado: string): CustomerOrder['status'] {
  const normalized = estado.toLowerCase();
  const map: Record<string, CustomerOrder['status']> = {
    pendiente: 'pending',
    procesando: 'processing',
    enviado: 'shipped',
    entregado: 'delivered',
    cancelado: 'cancelled',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    pending: 'pending',
  };
  return map[normalized] ?? 'pending';
}

function adaptOrder(p: PedidoDTO): CustomerOrder {
  const addr = p.direccion ?? {};
  const orderItems = (p.items ?? []).map((item) => ({
    productId: item.producto_id,
    productName: item.nombre_producto,
    quantity: item.cantidad,
    price: item.precio_unitario,
  }));

  return {
    id: String(p.pedido_id),
    customerName: p.usuario_id,
    customerEmail: '',
    status: mapEstado(p.estado),
    date: p.fecha_pedido,
    total: p.total,
    items: orderItems,
    shippingAddress: [addr['calle'], addr['colonia']].filter(Boolean).join(', '),
    paymentMethod: 'No especificado',
    storeId: '',
    storeName: '',
    shippingMethod: 'Estándar',
    shippingCost: 0,
  };
}

// ─── Service ─────────────────────────────────────────────

export const customerOrderService = {
  /**
   * GET /pedidos/user/{usuario_id}
   */
  list: async (): Promise<CustomerOrder[]> => {
    const userId = useCustomerAuthStore.getState().customer?.id ?? '';
    if (!userId) return [];
    const data = await apiClient.get<PedidoDTO[]>(`/pedidos/user/${userId}`, 'customer', 'products');
    return data.map(adaptOrder);
  },

  /**
   * GET /pedidos/{pedido_id}
   */
  getById: async (id: string): Promise<CustomerOrder> => {
    const data = await apiClient.get<PedidoDTO>(`/pedidos/${id}`, 'customer', 'products');
    return adaptOrder(data);
  },

  /**
   * POST /pedidos/
   */
  create: async (input: PlaceOrderInput): Promise<CustomerOrder> => {
    const direccionId = Number(input.shippingAddressId);
    if (!Number.isFinite(direccionId) || direccionId <= 0) {
      throw new Error('La dirección seleccionada no es válida para crear el pedido.');
    }

    const payload: CreatePedidoDTO = {
      direccion_id: direccionId,
      promocion: null,
      notas: null,
    };

    const data = await apiClient.post<PedidoDTO>(
      '/pedidos/',
      payload,
      'customer',
      'products'
    );
    return adaptOrder(data);
  },
};
