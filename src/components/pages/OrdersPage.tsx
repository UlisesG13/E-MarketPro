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
        <h1 className="text-2xl font-bold text-white">Órdenes</h1>
        <p className="text-gray-400 text-sm mt-1">{filtered.length} órdenes encontradas</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por ID o cliente..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setCurrentPage(1); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                statusFilter === s.value ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">ID</th>
                <th className="text-left p-4 text-gray-400 font-medium">Cliente</th>
                <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Productos</th>
                <th className="text-right p-4 text-gray-400 font-medium">Total</th>
                <th className="text-center p-4 text-gray-400 font-medium">Estado</th>
                <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">Fecha</th>
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
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 text-indigo-400 font-mono text-xs">{order.id}</td>
                    <td className="p-4 text-white">{order.customerName}</td>
                    <td className="p-4 text-gray-400 hidden md:table-cell">{order.items.length} artículo(s)</td>
                    <td className="p-4 text-white font-medium text-right">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={status.variant} dot>{status.label}</Badge>
                    </td>
                    <td className="p-4 text-gray-400 hidden lg:table-cell">{formatDate(order.date)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
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
              className="absolute right-0 top-0 bottom-0 w-full max-w-md border-l border-white/10 bg-[#0f0f1a] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Detalle de orden</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-mono text-sm">{selectedOrder.id}</span>
                    <Badge variant={statusConfig[selectedOrder.status].variant} dot>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="text-sm text-white font-medium">{selectedOrder.customerName}</p>
                      <p className="text-xs text-gray-400">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dirección de envío</p>
                      <p className="text-sm text-gray-300">{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Método de pago</p>
                      <p className="text-sm text-gray-300">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha</p>
                      <p className="text-sm text-gray-300">{formatDate(selectedOrder.date)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white mb-3">Productos</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                          <div>
                            <p className="text-sm text-white">{item.productName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm text-white font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-sm font-medium text-indigo-300">Total</span>
                    <span className="text-xl font-bold text-white">{formatCurrency(selectedOrder.total)}</span>
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
