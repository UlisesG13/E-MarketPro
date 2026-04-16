import React from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import { useCustomerOrdersStore } from '../../../../entities/customer/store/customerOrdersStore';
import { formatCurrency, formatDate } from '../../../../shared/utils/format';
import Badge from '../../../../shared/components/atoms/Badge';
import EmptyState from '../../../../shared/components/molecules/EmptyState';

const statusVariant = {
  pending: 'warning',
  processing: 'info',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'danger',
} as const;

const statusLabel = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
} as const;

const AccountOrdersPage: React.FC = () => {
  const orders = useCustomerOrdersStore((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={PackageCheck}
          title="Aún no tienes pedidos"
          description="Cuando completes una compra, aquí verás el historial con estado, total y seguimiento."
          action={
            <Link
              to="/store"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Explorar tienda
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-white">Historial de pedidos</h1>
        <p className="mt-1 text-sm text-gray-400">
          Consulta el estado, el total y la trazabilidad de tus compras.
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order: import('../../../../entities/customer/types/order.types').CustomerOrder) => (
          <article
            key={order.id}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">{order.id}</h2>
                  <Badge variant={statusVariant[order.status as keyof typeof statusVariant]}>
                    {statusLabel[order.status as keyof typeof statusLabel]}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm text-gray-400 sm:grid-cols-2">
                  <p>Fecha: {formatDate(order.date)}</p>
                  <p>Total: {formatCurrency(order.total)}</p>
                  <p>Pago: {order.paymentMethod}</p>
                  <p>Envío: {order.shippingMethod}</p>
                </div>
                <p className="text-sm text-gray-500">Dirección: {order.shippingAddress}</p>
                {order.trackingCode ? (
                  <p className="text-sm text-cyan-300">Tracking: {order.trackingCode}</p>
                ) : null}
              </div>

              <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4 lg:w-[320px]">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Productos</p>
                <div className="mt-3 space-y-3">
                  {order.items.map((item: import('../../../../shared/types/common.types').OrderItem) => (
                    <div key={`${order.id}-${item.productId}`} className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-medium text-white">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AccountOrdersPage;
