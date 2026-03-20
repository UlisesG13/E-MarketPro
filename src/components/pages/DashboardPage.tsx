import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, ShoppingBag, TrendingUp,
  Package, CreditCard, UserPlus, Truck, Star, RotateCcw, Tag as TagIcon,
} from 'lucide-react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../molecules/StatCard';
import {
  weeklyRevenue, recentActivities,
} from '../../services/mockData';
import { formatCurrency } from '../../utils/format';

const activityIcons: Record<string, React.ReactNode> = {
  order: <ShoppingBag className="w-4 h-4" />,
  product: <Package className="w-4 h-4" />,
  payment: <CreditCard className="w-4 h-4" />,
  user: <UserPlus className="w-4 h-4" />,
  shipping: <Truck className="w-4 h-4" />,
  review: <Star className="w-4 h-4" />,
  return: <RotateCcw className="w-4 h-4" />,
  promo: <TagIcon className="w-4 h-4" />,
};

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen general de tu tienda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ingresos del mes" value={189600} prefix="$" trend={12.5} icon={<DollarSign className="w-6 h-6" />} delay={0} />
        <StatCard label="Clientes activos" value={1247} trend={8.3} icon={<Users className="w-6 h-6" />} delay={0.1} />
        <StatCard label="Órdenes pendientes" value={38} trend={-5.2} icon={<ShoppingBag className="w-6 h-6" />} delay={0.2} />
        <StatCard label="Ticket promedio" value={4726} prefix="$" trend={3.1} icon={<TrendingUp className="w-6 h-6" />} delay={0.3} />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Ingresos por semana</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Actividad reciente</h3>
        <div className="space-y-3">
          {recentActivities.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                {activityIcons[a.type] || <Package className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{a.action}</p>
                <p className="text-xs text-gray-500 truncate">{a.description}</p>
              </div>
              <span className="text-xs text-gray-500 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
