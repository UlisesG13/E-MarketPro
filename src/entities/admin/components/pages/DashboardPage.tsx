import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingBag, TrendingUp,
  Package, CreditCard, UserPlus, Truck, Star, RotateCcw, Tag as TagIcon,
} from 'lucide-react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../../../../shared/components/molecules/StatCard';
import Spinner from '../../../../shared/components/atoms/Spinner';
import { formatCurrency, formatDate } from '../../../../shared/utils/format';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { useAdminOrders } from '../../hooks/useAdminOrders';

const activityIcons: Record<string, React.ReactNode> = {
  pending: <Package className="w-4 h-4" />,
  processing: <CreditCard className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <Star className="w-4 h-4" />,
  cancelled: <RotateCcw className="w-4 h-4" />,
  order: <ShoppingBag className="w-4 h-4" />,
  user: <UserPlus className="w-4 h-4" />,
  promo: <TagIcon className="w-4 h-4" />,
};

const DashboardPage: React.FC = () => {
  const { kpis, weeklyRevenue, topProducts, isLoading, error } = useAdminAnalytics();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 8, page: 1 });

  const recentOrders = ordersData?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <p className="text-[var(--app-text)] font-medium">Error al cargar el dashboard</p>
          <p className="text-sm text-[var(--app-text-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  const kpiIcons = [
    <DollarSign className="w-6 h-6" />,
    <ShoppingBag className="w-6 h-6" />,
    <TrendingUp className="w-6 h-6" />,
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Resumen general de tu tienda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            prefix={kpi.prefix}
            trend={kpi.trend}
            icon={kpiIcons[i] ?? <DollarSign className="w-6 h-6" />}
            delay={i * 0.1}
          />
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
      >
        <h3 className="mb-4 text-sm font-semibold text-[var(--app-text)]">Ingresos últimos 7 días</h3>
        {weeklyRevenue.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-[var(--app-text-muted)]">
            Sin ventas en los últimos 7 días
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--app-primary)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--app-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
              <XAxis dataKey="week" stroke="var(--app-text-soft)" fontSize={12} />
              <YAxis stroke="var(--app-text-soft)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--app-surface-strong)', border: '1px solid var(--app-border)', borderRadius: '12px', color: 'var(--app-text)', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--app-primary)" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
        >
          <h3 className="mb-4 text-sm font-semibold text-[var(--app-text)]">Órdenes recientes</h3>
          {ordersLoading ? (
            <div className="flex justify-center py-6"><Spinner /></div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--app-text-muted)] py-4 text-center">Sin órdenes todavía</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--app-surface-soft)]">
                  <div className="shrink-0 rounded-lg bg-[var(--app-primary-soft)] p-2 text-[var(--app-primary)]">
                    {activityIcons[order.status] ?? <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--app-text)] truncate">{order.customer_name}</p>
                    <p className="truncate text-xs text-[var(--app-text-soft)]">{order.status} · {formatDate(order.created_at)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[var(--app-text)]">{formatCurrency(Number(order.total))}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]"
        >
          <h3 className="mb-4 text-sm font-semibold text-[var(--app-text)]">Productos más vendidos</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[var(--app-text-muted)] py-4 text-center">Sin datos de ventas todavía</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--app-surface-soft)]">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--app-primary-soft)] text-[var(--app-primary)] text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--app-text)] truncate">{product.name}</p>
                    <p className="text-xs text-[var(--app-text-soft)]">{product.units} unidades vendidas</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[var(--app-text)]">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
