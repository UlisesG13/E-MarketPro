import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Check, X, ArrowRight, Zap, Crown, Building2,
  BarChart3, CreditCard, Headphones, Puzzle, TrendingUp, DollarSign, Users, ShoppingBag,
  Package, ShoppingCart, Mail, Brain, Plug, Globe, Activity, Code, Palette, Server, UserCheck, Infinity as InfinityIcon,
  Shield, Star, Calculator, ChevronRight,
} from 'lucide-react';
import { planDetails, pricingPlans, testimonials, faqItems } from '../../services/mockData';
import { formatCurrency, formatNumber } from '../../utils/format';
import { cn } from '../../utils/cn';
import { usePlanStore } from '../../store/planStore';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import FAQAccordion from '../molecules/FAQAccordion';

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  Puzzle: <Puzzle className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Plug: <Plug className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
};

const planIcons: Record<string, React.ReactNode> = {
  basico: <Zap className="w-8 h-8" />,
  pro: <Crown className="w-8 h-8" />,
  enterprise: <Building2 className="w-8 h-8" />,
};

const kpiIcons = [
  <DollarSign className="w-6 h-6" />,
  <Users className="w-6 h-6" />,
  <ShoppingBag className="w-6 h-6" />,
  <TrendingUp className="w-6 h-6" />,
];

function HeroBackground({ gradient }: { gradient: [string, string] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-[128px] opacity-20" style={{ background: gradient[0] }} />
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full blur-[128px] opacity-15" style={{ background: gradient[1] }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }} />
    </div>
  );
}

function LimitBadge({ label, value }: { label: string; value: number | 'unlimited' }) {
  const isUnlimited = value === 'unlimited';
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5">
      {isUnlimited ? (
        <InfinityIcon className="w-7 h-7 text-emerald-400" />
      ) : (
        <span className="text-2xl font-bold text-white">{formatNumber(value)}</span>
      )}
      <span className="text-xs text-gray-400 text-center">{label}</span>
      {isUnlimited && <span className="text-xs font-medium text-emerald-400">Ilimitado</span>}
    </div>
  );
}

const PlanDetailPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const { billingPeriod, toggleBillingPeriod, selectPlan } = usePlanStore();
  const [roiProducts, setRoiProducts] = useState('200');
  const [roiSales, setRoiSales] = useState('50000');

  if (!planId || !planDetails[planId]) {
    return <Navigate to="/" replace />;
  }

  const plan = planDetails[planId];
  const isAnnual = billingPeriod === 'annual';
  const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
  const planTestimonials = testimonials.filter((t) => t.plan === planId);

  const monthlyPlatformCost = price;
  const estimatedCommission = (Number(roiSales) || 0) * 0.029;
  const totalMonthlyCost = monthlyPlatformCost + estimatedCommission;
  const estimatedROI = ((Number(roiSales) || 0) - totalMonthlyCost) / totalMonthlyCost * 100;

  const handleSelectPlan = () => {
    selectPlan(planId);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="relative py-20 px-6">
        <HeroBackground gradient={plan.gradient} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {plan.badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: plan.accentColor }} />
              {plan.badge}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}
          >
            {planIcons[planId]}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Plan{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>
              {plan.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-6"
          >
            {plan.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className={cn('text-sm font-medium', !isAnnual ? 'text-white' : 'text-gray-500')}>Mensual</span>
            <button
              onClick={toggleBillingPeriod}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                isAnnual ? 'bg-emerald-500' : 'bg-white/20'
              )}
              aria-label="Toggle billing period"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
            <span className={cn('text-sm font-medium', isAnnual ? 'text-white' : 'text-gray-500')}>
              Anual
              <span className="ml-1.5 text-xs text-emerald-400 font-semibold">-20%</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-baseline justify-center gap-2 mb-8"
          >
            <span className="text-5xl md:text-6xl font-black text-white">
              {formatCurrency(price)}
            </span>
            <span className="text-xl text-gray-400">/mes</span>
            {isAnnual && (
              <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(plan.price)}</span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={`/checkout/${planId}`} onClick={handleSelectPlan}>
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Comenzar con {plan.name}
              </Button>
            </Link>
            <Link to="/comparar">
              <Button variant="outline" size="lg">Comparar planes</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300">
              <strong>14 días de prueba gratuita</strong> sin tarjeta de crédito. Cancela cuando quieras, sin compromiso.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Así se ve tu{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>dashboard</span>
            </h2>
            <p className="text-gray-400">Datos simulados del rendimiento con el plan {plan.name}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {plan.simulatedKPIs.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 group hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl" style={{ background: `${plan.accentColor}15` }}>
                    <span style={{ color: plan.accentColor }}>{kpiIcons[i]}</span>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    kpi.trend > 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                  )}>
                    {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {kpi.prefix}{formatNumber(kpi.value)}{kpi.suffix}
                </p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold text-white mb-4">Proyección de ingresos mensuales</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={plan.simulatedRevenue}>
                <defs>
                  <linearGradient id={`grad-${planId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={plan.accentColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={plan.accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
                />
                <Area type="monotone" dataKey="revenue" stroke={plan.accentColor} strokeWidth={2} fill={`url(#grad-${planId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Características{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>incluidas</span>
            </h2>
            <p className="text-gray-400">Todo lo que obtienes con el plan {plan.name}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {plan.featureGroups.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                  <div className="p-2 rounded-lg" style={{ background: `${plan.accentColor}15` }}>
                    <span style={{ color: plan.accentColor }}>{iconMap[group.icon] || <BarChart3 className="w-5 h-5" />}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{group.category}</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {group.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3 px-6 py-4">
                      {item.included ? (
                        <div className="mt-0.5 p-1 rounded-full bg-emerald-400/10"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                      ) : (
                        <div className="mt-0.5 p-1 rounded-full bg-white/5"><X className="w-3.5 h-3.5 text-gray-600" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium', item.included ? 'text-white' : 'text-gray-600')}>{item.name}</p>
                        <p className={cn('text-xs mt-0.5', item.included ? 'text-gray-400' : 'text-gray-700')}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Límites del{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>plan</span>
            </h2>
            <p className="text-gray-400">Recursos disponibles con tu suscripción</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LimitBadge label="Productos" value={plan.limits.products} />
            <LimitBadge label="Usuarios" value={plan.limits.users} />
            <LimitBadge label="Almacenamiento" value={plan.limits.storageMB === 'unlimited' ? 'unlimited' : plan.limits.storageMB} />
            <LimitBadge label="Llamadas API / mes" value={plan.limits.apiCalls} />
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Herramientas{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>disponibles</span>
            </h2>
            <p className="text-gray-400">Todo lo que necesitas para gestionar tu negocio</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plan.tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${plan.accentColor}10` }}>
                  <span style={{ color: plan.accentColor }} className="group-hover:scale-110 transition-transform inline-block">
                    {iconMap[tool.icon] || <Package className="w-5 h-5" />}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{tool.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Calculadora de{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>ROI</span>
            </h2>
            <p className="text-gray-400">Estima cuánto puedes ganar con E-MARKET PRO</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ background: `${plan.accentColor}15` }}>
                    <Calculator className="w-5 h-5" style={{ color: plan.accentColor }} />
                  </div>
                  <h3 className="text-base font-semibold text-white">Ingresa tus datos</h3>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Productos en tu catálogo</label>
                  <input
                    type="number"
                    value={roiProducts}
                    onChange={(e) => setRoiProducts(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Ventas mensuales estimadas (MXN)</label>
                  <input
                    type="number"
                    value={roiSales}
                    onChange={(e) => setRoiSales(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white mb-4">Resultados estimados</h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Costo mensual de plataforma</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(monthlyPlatformCost)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Comisión estimada por transacciones</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(estimatedCommission)}</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ borderColor: `${plan.accentColor}30`, background: `${plan.accentColor}08` }}>
                  <p className="text-xs text-gray-400 mb-1">ROI estimado</p>
                  <p className="text-3xl font-black" style={{ color: plan.accentColor }}>
                    {estimatedROI > 0 ? '+' : ''}{estimatedROI.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Retorno sobre inversión mensual</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {planTestimonials.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Lo que dicen{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>nuestros clientes</span>
              </h2>
              <p className="text-gray-400">Historias reales de negocios como el tuyo</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {planTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Compara con{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>otros planes</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Precio</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Productos</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Usuarios</th>
                  <th className="text-center p-4 text-gray-400 font-medium">IA</th>
                  <th className="text-center p-4 text-gray-400 font-medium">API</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((p) => {
                  const isCurrentPlan = p.slug === planId;
                  const detail = planDetails[p.slug];
                  const hasIA = detail?.featureGroups.find((g) => g.category === 'Analítica')?.items.find((i) => i.name.includes('IA'))?.included ?? false;
                  const hasAPI = detail?.featureGroups.find((g) => g.category === 'Integraciones')?.items.find((i) => i.name.includes('API REST'))?.included ?? false;

                  return (
                    <tr key={p.slug} className={cn('border-b border-white/5 transition-colors', isCurrentPlan ? 'bg-white/5' : 'hover:bg-white/[0.02]')}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold', isCurrentPlan ? 'text-white' : 'text-gray-300')}>{p.name}</span>
                          {isCurrentPlan && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: plan.accentColor }}>ACTUAL</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{formatCurrency(p.price)}{p.period}</td>
                      <td className="p-4 text-center text-gray-300">{detail?.limits.products === 'unlimited' ? '∞' : detail?.limits.products}</td>
                      <td className="p-4 text-center text-gray-300">{detail?.limits.users === 'unlimited' ? '∞' : detail?.limits.users}</td>
                      <td className="p-4 text-center">{hasIA ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}</td>
                      <td className="p-4 text-center">{hasAPI ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          <div className="text-center mt-6">
            <Link to="/comparar" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Ver comparativa completa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Preguntas{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>frecuentes</span>
            </h2>
            <p className="text-gray-400">Todo lo que necesitas saber antes de comenzar</p>
          </motion.div>

          <FAQAccordion items={faqItems} accentColor={plan.accentColor} />
        </div>
      </section>

      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}08, ${plan.gradient[1]}08)` }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}>comenzar</span>?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Activa tu plan {plan.name} hoy y lleva tu negocio al siguiente nivel.
              Sin permanencia mínima, cancela cuando quieras.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={`/checkout/${planId}`} onClick={handleSelectPlan}>
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Comenzar con {plan.name} — {formatCurrency(price)}/mes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PlanDetailPage;
