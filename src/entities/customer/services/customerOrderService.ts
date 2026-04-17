import { apiClient } from '../../../shared/services/apiClient';
import type { CustomerOrder, PlaceOrderInput } from '../types/order.types';

// ─── Backend DTOs ─────────────────────────────────────────

interface BackendPedido {
  pedido_id: number;
  usuario_id: string;
  estado: string;
  fecha_pedido: string;
  subtotal: number;
  total?: number;
  notas: string;
  direccion: Record<string, unknown>;
}

// ─── Adapter ─────────────────────────────────────────────

function mapEstado(estado: string): CustomerOrder['status'] {
  const map: Record<string, CustomerOrder['status']> = {
    pendiente: 'pending',
    procesando: 'processing',
    enviado: 'shipped',
    entregado: 'delivered',
    cancelado: 'cancelled',
  };
  return map[estado] ?? 'pending';
}

function adaptOrder(p: BackendPedido): CustomerOrder {
  const addr = p.direccion ?? {};
  return {
    id: String(p.pedido_id),
    customerName: p.usuario_id,
    customerEmail: '',
    status: mapEstado(p.estado),
    date: p.fecha_pedido,
    total: p.total ?? p.subtotal,
    items: [],
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
   * GET /pedidos/user/:userId/
   */
  list: async (): Promise<CustomerOrder[]> => {
    const raw = localStorage.getItem('emarketpro-customer-auth');
    const userId: string = raw ? (JSON.parse(raw)?.state?.user?.id ?? '') : '';
    if (!userId) return [];
    const data = await apiClient.get<BackendPedido[]>(`/pedidos/user/${userId}`, 'customer');
    return data.map(adaptOrder);
  },

  /**
   * GET /pedidos/:id/
   */
  getById: async (id: string): Promise<CustomerOrder> => {
    const data = await apiClient.get<BackendPedido>(`/pedidos/${id}`, 'customer');
    return adaptOrder(data);
  },

  /**
   * POST /pedidos/
   */
  create: async (input: PlaceOrderInput): Promise<CustomerOrder> => {
    const raw = localStorage.getItem('emarketpro-customer-auth');
    const userId: string = raw ? (JSON.parse(raw)?.state?.user?.id ?? '') : '';

    const subtotal = input.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

    const data = await apiClient.post<BackendPedido>(
      '/pedidos/',
      {
        usuario_id: userId,
        estado: 'pendiente',
        subtotal,
        notas: '',
        direccion: { direccion_id: input.shippingAddressId },
      },
      'customer'
    );
    return adaptOrder(data);
  },
};
