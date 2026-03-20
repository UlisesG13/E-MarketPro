import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, ShoppingBag, TrendingUp,
  Package, CreditCard, UserPlus, Truck, Star, RotateCcw, Tag as TagIcon,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../molecules/StatCard';
import Badge from '../atoms/Badge';
import {
  weeklyRevenue, phaseActivityData, costByRole,
  recentActivities, projectTimeline,
} from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

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

const timelineStatusColors = {
  completed: 'bg-emerald-500',
  current: 'bg-indigo-500 animate-pulse',
  upcoming: 'bg-white/20',
};

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen general del proyecto E-MARKET PRO</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ingresos del mes" value={189600} prefix="$" trend={12.5} icon={<DollarSign className="w-6 h-6" />} delay={0} />
        <StatCard label="Clientes activos" value={1247} trend={8.3} icon={<Users className="w-6 h-6" />} delay={0.1} />
        <StatCard label="Órdenes pendientes" value={38} trend={-5.2} icon={<ShoppingBag className="w-6 h-6" />} delay={0.2} />
        <StatCard label="Ticket promedio" value={4726} prefix="$" trend={3.1} icon={<TrendingUp className="w-6 h-6" />} delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart – Revenue by week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Ingresos por semana</h3>
          <ResponsiveContainer width="100%" height={280}>
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

        {/* Donut Chart – Cost by role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Costos por rol</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={costByRole}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="amount"
                nameKey="role"
              >
                {costByRole.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {costByRole.map((c) => (
              <div key={c.role} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-gray-400 flex-1">{c.role}</span>
                <span className="text-white font-medium">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart – Activity by phase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Actividad por fase del proyecto</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={phaseActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="phase" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Legend />
            <Bar dataKey="hours" name="Horas" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cost" name="Costo ($)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Activities Table + Timeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5"
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

        {/* Project Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Cronograma del proyecto</h3>
          <div className="space-y-4">
            {projectTimeline.map((t, i) => (
              <div key={t.week} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={cn('w-3 h-3 rounded-full', timelineStatusColors[t.status])} />
                  {i < projectTimeline.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={t.status === 'completed' ? 'success' : t.status === 'current' ? 'info' : 'default'}>
                      {t.week}
                    </Badge>
                    <span className="text-sm font-medium text-white">{t.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
