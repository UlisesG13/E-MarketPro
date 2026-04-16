import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import SearchBar from '../molecules/SearchBar';
import Spinner from '../atoms/Spinner';
import type { Order, OrderStatus } from '../../types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'purple' | 'success' | 'danger' }> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  processing: { label: 'En proceso', variant: 'info' },
  shipped: { label: 'Enviado', variant: 'purple' },
  delivered: { label: 'Entregado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Órdenes</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">{filtered.length} órdenes encontradas</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por ID o cliente..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              type="button"
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setCurrentPage(1); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                statusFilter === s.value ? 'bg-[var(--app-primary)] text-white' : 'border border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
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
              {paginated.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="cursor-pointer border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-soft)]"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 font-mono text-xs text-[var(--app-primary)]">{order.id}</td>
                    <td className="p-4 text-[var(--app-text)]">{order.customerName}</td>
                    <td className="hidden p-4 text-[var(--app-text-muted)] md:table-cell">{order.items.length} artículo(s)</td>
                    <td className="p-4 text-right font-medium text-[var(--app-text)]">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={status.variant} dot>{status.label}</Badge>
                    </td>
                    <td className="hidden p-4 text-[var(--app-text-muted)] lg:table-cell">{formatDate(order.date)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--app-border)] p-4">
          <p className="text-xs text-[var(--app-text-soft)]">
            Mostrando {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} de {filtered.length}
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
              disabled={currentPage === totalPages}
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
                    <span className="font-mono text-sm text-[var(--app-primary)]">{selectedOrder.id}</span>
                    <Badge variant={statusConfig[selectedOrder.status].variant} dot>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>

                  <div className="space-y-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Cliente</p>
                      <p className="text-sm font-medium text-[var(--app-text)]">{selectedOrder.customerName}</p>
                      <p className="text-xs text-[var(--app-text-muted)]">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Dirección de envío</p>
                      <p className="text-sm text-[var(--app-text-muted)]">{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Método de pago</p>
                      <p className="text-sm text-[var(--app-text-muted)]">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--app-text-soft)]">Fecha</p>
                      <p className="text-sm text-[var(--app-text-muted)]">{formatDate(selectedOrder.date)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[var(--app-text)]">Productos</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3">
                          <div>
                            <p className="text-sm text-[var(--app-text)]">{item.productName}</p>
                            <p className="text-xs text-[var(--app-text-soft)]">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-[var(--app-text)]">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-[var(--app-border-strong)] bg-[var(--app-primary-soft)] p-4">
                    <span className="text-sm font-medium text-[var(--app-primary)]">Total</span>
                    <span className="text-xl font-bold text-[var(--app-text)]">{formatCurrency(selectedOrder.total)}</span>
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
