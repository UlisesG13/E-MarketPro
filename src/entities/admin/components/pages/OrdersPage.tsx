import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../shared/utils/format';
import { cn } from '../../../../shared/utils/cn';
import Badge from '../../../../shared/components/atoms/Badge';
import Button from '../../../../shared/components/atoms/Button';
import SearchBar from '../../../../shared/components/molecules/SearchBar';
import Spinner from '../../../../shared/components/atoms/Spinner';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useAdminOrders';
import { useDebounce } from '../../../../shared/hooks/useDebounce';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'purple' | 'success' | 'danger' }> = {
  pending:    { label: 'Pendiente',  variant: 'warning' },
  processing: { label: 'En proceso', variant: 'info' },
  shipped:    { label: 'Enviado',    variant: 'purple' },
  delivered:  { label: 'Entregado', variant: 'success' },
  cancelled:  { label: 'Cancelado', variant: 'danger' },
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const perPage = 10;

const OrdersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading: loading, isFetching } = useAdminOrders({
    page: currentPage,
    limit: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: debouncedSearch || undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  const orders = data?.items ?? [];
  const totalOrders = data?.total ?? 0;
  const totalPages = Math.ceil(totalOrders / perPage);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate({ id: orderId, status: newStatus });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Órdenes</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          {isFetching ? 'Actualizando...' : `${totalOrders} órdenes en total`}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por cliente..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              type="button"
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setCurrentPage(1); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                statusFilter === s.value
                  ? 'bg-[var(--app-primary)] text-white'
                  : 'border border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-soft)]">
                <th className="p-4 text-left font-medium text-[var(--app-text-muted)]">ID</th>
                <th className="p-4 text-left font-medium text-[var(--app-text-muted)]">Cliente</th>
                <th className="hidden p-4 text-left font-medium text-[var(--app-text-muted)] md:table-cell">Productos</th>
                <th className="p-4 text-right font-medium text-[var(--app-text-muted)]">Total</th>
                <th className="p-4 text-center font-medium text-[var(--app-text-muted)]">Estado</th>
                <th className="hidden p-4 text-left font-medium text-[var(--app-text-muted)] lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[var(--app-text-muted)]">
                    No hay órdenes con los filtros aplicados
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = statusConfig[order.status as OrderStatus] ?? { label: order.status, variant: 'info' as const };
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="cursor-pointer border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-soft)]"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4 font-mono text-xs text-[var(--app-primary)]">{String(order.id).slice(0, 8)}…</td>
                      <td className="p-4 text-[var(--app-text)]">{order.customer_name}</td>
                      <td className="hidden p-4 text-[var(--app-text-muted)] md:table-cell">
                        {order.items?.length ?? 0} artículo(s)
                      </td>
                      <td className="p-4 text-right font-medium text-[var(--app-text)]">{formatCurrency(Number(order.total))}</td>
                      <td className="p-4 text-center">
                        <Badge variant={status.variant} dot>{status.label}</Badge>
                      </td>
                      <td className="hidden p-4 text-[var(--app-text-muted)] lg:table-cell">{formatDate(order.created_at)}</td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--app-border)] p-4">
          <p className="text-xs text-[var(--app-text-soft)]">
            {totalOrders === 0
              ? '0 órdenes'
              : `Página ${currentPage} de ${totalPages} · ${totalOrders} órdenes`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto border-l border-[var(--app-border)] bg-[var(--app-surface-strong)] shadow-[var(--app-shadow)]"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[var(--app-text)]">Detalle de orden</h2>
                  <button type="button" onClick={() => setSelectedOrder(null)} className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[var(--app-primary)]">{String(selectedOrder.id).slice(0, 8)}…</span>
                    <Badge variant={(statusConfig[selectedOrder.status as OrderStatus] ?? { variant: 'info' }).variant} dot>
                      {(statusConfig[selectedOrder.status as OrderStatus] ?? { label: selectedOrder.status }).label}
                    </Badge>
                  </div>

                  {/* Customer info */}
                  <div className="space-y-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Cliente</p>
                      <p className="text-sm font-medium text-[var(--app-text)]">{selectedOrder.customer_name}</p>
                      <p className="text-xs text-[var(--app-text-muted)]">{selectedOrder.customer_email}</p>
                    </div>
                    {selectedOrder.shipping_address && (
                      <div>
                        <p className="text-xs text-[var(--app-text-soft)]">Dirección de envío</p>
                        <p className="text-sm text-[var(--app-text-muted)]">
                          {typeof selectedOrder.shipping_address === 'string'
                            ? selectedOrder.shipping_address
                            : `${selectedOrder.shipping_address.street}, ${selectedOrder.shipping_address.city}, ${selectedOrder.shipping_address.state}`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Fecha</p>
                      <p className="text-sm text-[var(--app-text-muted)]">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-[var(--app-text)]">Productos</p>
                    <div className="space-y-2">
                      {(selectedOrder.items ?? []).map((item: { id: string; product_name: string; quantity: number; unit_price: number; subtotal: number }) => (
                        <div key={item.id} className="flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3">
                          <div>
                            <p className="text-sm text-[var(--app-text)]">{item.product_name}</p>
                            <p className="text-xs text-[var(--app-text-soft)]">Qty: {item.quantity} × {formatCurrency(Number(item.unit_price))}</p>
                          </div>
                          <p className="text-sm font-medium text-[var(--app-text)]">{formatCurrency(Number(item.subtotal))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between rounded-xl border border-[var(--app-border-strong)] bg-[var(--app-primary-soft)] p-4">
                    <span className="text-sm font-medium text-[var(--app-primary)]">Total</span>
                    <span className="text-xl font-bold text-[var(--app-text)]">{formatCurrency(Number(selectedOrder.total))}</span>
                  </div>

                  {/* Change Status */}
                  <div>
                    <p className="mb-2 text-xs text-[var(--app-text-soft)]">Cambiar estado</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(statusConfig) as OrderStatus[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={selectedOrder.status === s || updateStatus.isPending}
                          onClick={() => handleStatusChange(String(selectedOrder.id), s)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                            selectedOrder.status === s
                              ? 'bg-[var(--app-primary)] text-white border-[var(--app-primary)]'
                              : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        >
                          {statusConfig[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
