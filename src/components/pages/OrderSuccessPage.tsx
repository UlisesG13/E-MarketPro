import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import { formatCurrency, formatDate } from '../../utils/format';
import EmptyState from '../molecules/EmptyState';

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const lastOrderId = useCustomerStore((state) => state.lastOrderId);
  const getOrderById = useCustomerStore((state) => state.getOrderById);
  const order = getOrderById(orderId ?? lastOrderId ?? '');

  if (!order) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={CheckCircle2}
          title="No encontramos la orden"
          description="Parece que el resumen ya no está disponible. Puedes revisar tus pedidos desde cuenta."
          action={
            <Link
              to="/account/orders"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Ir a mis pedidos
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-12">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_35%),rgba(255,255,255,0.04)] p-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">Pedido confirmado</p>
        <h1 className="mt-3 text-4xl font-black text-white">Gracias por tu compra</h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-300">
          Tu orden ya fue registrada y el flujo quedó reflejado en tu historial. Desde aquí puedes
          seguir comprando o revisar el estado del pedido.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Número de orden</p>
              <p className="mt-2 text-xl font-semibold text-white">{order.id}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Fecha</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatDate(order.date)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Resumen</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.productId}`} className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-white">{item.productName}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Total</p>
            <p className="mt-2 text-3xl font-black text-white">{formatCurrency(order.total)}</p>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Estado: {order.status}</p>
            <p>Envío: {order.shippingMethod}</p>
            <p>Pago: {order.paymentMethod}</p>
            {order.trackingCode ? <p>Tracking: {order.trackingCode}</p> : null}
          </div>
          <div className="space-y-3 pt-3">
            <Link
              to="/account/orders"
              className="block rounded-xl bg-indigo-500 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Ver mis pedidos
            </Link>
            <Link
              to="/store"
              className="block rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Seguir comprando
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default OrderSuccessPage;
