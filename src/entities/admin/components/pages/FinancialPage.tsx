import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { DollarSign, TrendingUp, Users, Target, Calculator, CheckCircle } from 'lucide-react';
import { projectPhases, budgetSummary, competitors, costByRole } from '../../../../shared/services/mockData';
import { formatCurrency } from '../../../../shared/utils/format';
import { cn } from '../../../../shared/utils/cn';
import Badge from '../../../../shared/components/atoms/Badge';

/* ═══════════ Animated Number ═══════════ */
function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(eased * value);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{formatCurrency(count)}</span>;
}

/* ═══════════ Progress Bar ═══════════ */
function BreakevenProgress() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => setProgress(100), 300);
    return () => clearTimeout(timeout);
  }, [inView]);

  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">0 clientes</span>
        <span className="text-indigo-400 font-bold">44 clientes</span>
      </div>
      <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-xs mt-2">
        <span className="text-gray-500">Inversión: {formatCurrency(budgetSummary.grandTotal)}</span>
        <span className="text-emerald-400">ROI positivo ✓</span>
      </div>
    </div>
  );
}

/* ═══════════ Phase Colors ═══════════ */
const phaseColors: Record<string, string> = {
  'Inicio': '#6366f1',
  'Análisis': '#8b5cf6',
  'Diseño': '#06b6d4',
  'Construcción': '#10b981',
  'Pruebas': '#f59e0b',
  'Despliegue': '#ec4899',
  'Cierre': '#ef4444',
};

const FinancialPage: React.FC = () => {
  const totalCost = projectPhases.reduce(
    (sum, phase) => sum + phase.activities.reduce((s, a) => s + (a.cost ?? 0), 0), 0
  );

  const breakevenData = Array.from({ length: 66 }, (_, i) => ({
    clients: i,
    revenue: i * budgetSummary.grandTotal / 44,
    cost: budgetSummary.grandTotal,
  }));

  const phaseCostData = projectPhases.map((p) => ({
    phase: p.name,
    cost: p.activities.reduce((s, a) => s + (a.cost ?? 0), 0),
    fill: phaseColors[p.name] || '#6366f1',
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Análisis Financiero</h1>
        <p className="text-gray-400 text-sm mt-1">Presupuesto y viabilidad del proyecto E-MARKET PRO</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Costo Base', value: budgetSummary.baseCost, icon: <Calculator className="w-5 h-5" />, color: 'from-indigo-500/20 to-violet-500/20' },
          { label: 'Total con IVA', value: budgetSummary.grandTotal, icon: <DollarSign className="w-5 h-5" />, color: 'from-cyan-500/20 to-blue-500/20' },
          { label: 'Margen de Ganancia', value: budgetSummary.profitAmount, icon: <TrendingUp className="w-5 h-5" />, color: 'from-emerald-500/20 to-teal-500/20' },
          { label: 'Punto de Equilibrio', value: 44, icon: <Users className="w-5 h-5" />, color: 'from-amber-500/20 to-orange-500/20', isCurrency: false },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn('p-5 rounded-2xl border border-white/10 bg-gradient-to-br', kpi.color)}
          >
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              {kpi.icon}
              <span className="text-xs font-medium">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {'isCurrency' in kpi && !kpi.isCurrency
                ? `${kpi.value} clientes`
                : formatCurrency(kpi.value as number)
              }
            </p>
          </motion.div>
        ))}
      </div>

      {/* Budget Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Desglose de costos por fase</h3>
          <p className="text-sm text-gray-400 mt-1">Detalle de actividades, horas y costos del proyecto</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Fase</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actividad</th>
                <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Responsable</th>
                <th className="text-right p-4 text-gray-400 font-medium hidden sm:table-cell">Horas</th>
                <th className="text-right p-4 text-gray-400 font-medium">Costo</th>
              </tr>
            </thead>
            <tbody>
              {projectPhases.map((phase) =>
                phase.activities.map((activity, ai) => (
                  <tr key={`${phase.name}-${ai}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {ai === 0 && (
                      <td
                        className="p-4 font-semibold text-white"
                        rowSpan={phase.activities.length}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: phaseColors[phase.name] }} />
                          {phase.name}
                        </div>
                      </td>
                    )}
                    <td className="p-4 text-gray-300">{activity.name}</td>
                    <td className="p-4 text-gray-400 hidden md:table-cell">{activity.responsible}</td>
                    <td className="p-4 text-gray-300 text-right hidden sm:table-cell">{activity.hours} hrs</td>
                    <td className="p-4 text-white font-medium text-right">{formatCurrency(activity.cost ?? 0)}</td>
                  </tr>
                ))
              )}
              {/* Total row */}
              <tr className="bg-indigo-500/10 border-t-2 border-indigo-500/30">
                <td className="p-4 font-bold text-indigo-300" colSpan={3}>TOTAL DESARROLLO</td>
                <td className="p-4 text-indigo-300 text-right hidden sm:table-cell font-medium">
                  {projectPhases.reduce((s, p) => s + p.activities.reduce((sa, a) => sa + (a.hours ?? 0), 0), 0)} hrs
                </td>
                <td className="p-4 text-white text-right font-bold text-lg">{formatCurrency(totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Budget Final Calculation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Cálculo del presupuesto final</h3>
        <div className="max-w-lg space-y-4">
          {[
            { label: 'Costo base del proyecto', value: budgetSummary.baseCost },
            { label: 'Infraestructura (hosting, dominio, SSL)', value: budgetSummary.infrastructure, prefix: '+' },
            { label: 'Subtotal', value: budgetSummary.subtotal, isBold: true },
            { label: `Margen de ganancia (${budgetSummary.profitMargin * 100}%)`, value: budgetSummary.profitAmount, prefix: '+' },
            { label: 'Subtotal con ganancia', value: budgetSummary.subtotalWithProfit },
            { label: `IVA (${budgetSummary.taxRate * 100}%)`, value: budgetSummary.taxAmount, prefix: '+' },
          ].map((row, i) => (
            <div key={i} className={cn('flex justify-between items-center py-2', row.isBold && 'border-t border-white/10 pt-4')}>
              <span className={cn('text-sm', row.isBold ? 'text-white font-semibold' : 'text-gray-400')}>
                {row.prefix && <span className="text-emerald-400 mr-1">{row.prefix}</span>}
                {row.label}
              </span>
              <span className={cn('font-medium', row.isBold ? 'text-white text-lg' : 'text-gray-300')}>
                {formatCurrency(row.value)}
              </span>
            </div>
          ))}

          {/* Grand Total */}
          <div className="flex justify-between items-center py-4 mt-2 border-t-2 border-indigo-500/30 bg-indigo-500/5 -mx-6 px-6 rounded-xl">
            <span className="text-lg font-bold text-indigo-300">TOTAL FINAL (MXN)</span>
            <span className="text-3xl font-black text-white">
              <AnimatedNumber value={budgetSummary.grandTotal} />
            </span>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart: cost by phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Inversión por fase</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={phaseCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="phase" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Costo']}
              />
              <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                {phaseCostData.map((entry, i) => (
                  <motion.rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Breakeven Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Punto de equilibrio</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={breakevenData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="clients" stroke="#6b7280" fontSize={11} label={{ value: 'Clientes', position: 'insideBottom', offset: -5, style: { fill: '#6b7280', fontSize: 11 } }} />
              <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
              <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cost" name="Inversión" stroke="#ef4444" strokeWidth={2} strokeDasharray="8 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Breakeven Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-indigo-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Punto de Equilibrio</h3>
            <p className="text-sm text-gray-400">Se necesitan 44 clientes con plan Pro ({formatCurrency(799)}/mes) para recuperar la inversión en 12 meses</p>
          </div>
        </div>
        <BreakevenProgress />
      </motion.div>

      {/* Competitor Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Comparativa con competidores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Plataforma</th>
                <th className="text-left p-4 text-gray-400 font-medium">Costo mensual</th>
                <th className="text-left p-4 text-gray-400 font-medium">Comisión</th>
                <th className="text-center p-4 text-gray-400 font-medium">Dominio</th>
                <th className="text-center p-4 text-gray-400 font-medium">Analítica</th>
                <th className="text-left p-4 text-gray-400 font-medium">Soporte</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.name} className={cn('border-b border-white/5', c.highlighted ? 'bg-indigo-500/10' : 'hover:bg-white/5')}>
                  <td className={cn('p-4 font-semibold', c.highlighted ? 'text-indigo-400' : 'text-white')}>
                    {c.name}
                    {c.highlighted && <Badge variant="info" className="ml-2">Nosotros</Badge>}
                  </td>
                  <td className="p-4 text-gray-300">{c.monthlyFee}</td>
                  <td className="p-4 text-gray-300">{c.commission}</td>
                  <td className="p-4 text-center">
                    {c.customDomain ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="p-4 text-center">
                    {c.analytics ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="p-4 text-gray-300">{c.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Cost by Role */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-6 rounded-2xl border border-white/10 bg-white/5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Distribución de costos por recurso</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {costByRole.map((c) => (
            <div key={c.role} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className="text-sm text-gray-400">{c.role}</span>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(c.amount)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((c.amount / totalCost) * 100).toFixed(1)}% del total
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialPage;
