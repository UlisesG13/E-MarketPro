import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { pricingPlans, planDetails } from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';

const comparisonFeatures = [
  { label: 'Productos', key: 'products' },
  { label: 'Usuarios', key: 'users' },
  { label: 'Almacenamiento', key: 'storage' },
  { label: 'Llamadas API / mes', key: 'apiCalls' },
  { label: 'Panel de métricas', key: 'metrics' },
  { label: 'Reportes mensuales', key: 'monthlyReports' },
  { label: 'Dashboard con IA', key: 'aiDashboard' },
  { label: 'Reportes en tiempo real', key: 'realtimeReports' },
  { label: 'Pasarela de pagos', key: 'payments' },
  { label: 'Multi-moneda', key: 'multiCurrency' },
  { label: 'Soporte por email', key: 'emailSupport' },
  { label: 'Soporte 24/7', key: 'support247' },
  { label: 'Account manager', key: 'accountManager' },
  { label: 'API REST', key: 'apiRest' },
  { label: 'API privada', key: 'privateApi' },
  { label: 'White-label', key: 'whiteLabel' },
  { label: 'Infraestructura dedicada', key: 'dedicatedInfra' },
  { label: 'Onboarding personalizado', key: 'onboarding' },
];

function getFeatureValue(slug: string, key: string): string | boolean {
  const d = planDetails[slug];
  if (!d) return false;

  switch (key) {
    case 'products': return d.limits.products === 'unlimited' ? 'Ilimitados' : `${d.limits.products}`;
    case 'users': return d.limits.users === 'unlimited' ? 'Ilimitados' : `${d.limits.users}`;
    case 'storage': return d.limits.storageMB === 'unlimited' ? 'Ilimitado' : `${d.limits.storageMB} MB`;
    case 'apiCalls': return d.limits.apiCalls === 'unlimited' ? 'Ilimitadas' : `${d.limits.apiCalls.toLocaleString()}`;
    case 'metrics': return hasFeature(d, 'Analítica', 'Panel de métricas');
    case 'monthlyReports': return hasFeature(d, 'Analítica', 'Reportes mensuales');
    case 'aiDashboard': return hasFeature(d, 'Analítica', 'Dashboard con IA');
    case 'realtimeReports': return hasFeature(d, 'Analítica', 'Reportes en tiempo real');
    case 'payments': return true;
    case 'multiCurrency': return hasFeature(d, 'Pagos', 'Multi-moneda');
    case 'emailSupport': return hasFeature(d, 'Soporte', 'Soporte por email');
    case 'support247': return hasFeature(d, 'Soporte', 'Soporte 24/7');
    case 'accountManager': return hasFeature(d, 'Soporte', 'Account manager');
    case 'apiRest': return hasFeature(d, 'Integraciones', 'API REST');
    case 'privateApi': return hasFeature(d, 'Integraciones', 'API privada');
    case 'whiteLabel': return hasFeature(d, 'Integraciones', 'White-label');
    case 'dedicatedInfra': return slug === 'enterprise';
    case 'onboarding': return slug === 'enterprise';
    default: return false;
  }
}

function hasFeature(d: (typeof planDetails)[string], category: string, name: string): boolean {
  return d.featureGroups
    .find((g) => g.category === category)
    ?.items.find((i) => i.name.includes(name))?.included ?? false;
}

const ComparisonPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Comparativa{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              completa
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Compara todas las características de nuestros planes para encontrar el que mejor se adapte a tu negocio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto rounded-2xl border border-white/10"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium min-w-[200px]">Característica</th>
                {pricingPlans.map((p) => (
                  <th key={p.slug} className={cn(
                    'text-center p-4 font-medium min-w-[160px]',
                    p.highlighted ? 'text-indigo-400' : 'text-gray-400'
                  )}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base font-bold text-white">{p.name}</span>
                      <span className="text-sm">{formatCurrency(p.price)}/mes</span>
                      {p.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-semibold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, i) => (
                <tr
                  key={feature.key}
                  className={cn(
                    'border-b border-white/5 transition-colors hover:bg-white/[0.02]',
                    i % 2 === 0 && 'bg-white/[0.01]'
                  )}
                >
                  <td className="p-4 text-gray-300 font-medium">{feature.label}</td>
                  {pricingPlans.map((p) => {
                    const val = getFeatureValue(p.slug, feature.key);
                    return (
                      <td key={p.slug} className={cn('p-4 text-center', p.highlighted && 'bg-indigo-500/[0.03]')}>
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-white font-medium">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* CTAs at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          {pricingPlans.map((p) => {
            const d = planDetails[p.slug];
            return (
              <div
                key={p.slug}
                className={cn(
                  'rounded-2xl border p-6 text-center',
                  p.highlighted
                    ? 'border-indigo-500/50 bg-indigo-500/5'
                    : 'border-white/10 bg-white/5'
                )}
              >
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <p className="text-2xl font-black text-white mb-1">{formatCurrency(p.price)}<span className="text-sm font-normal text-gray-400">/mes</span></p>
                <p className="text-xs text-gray-500 mb-4">{d?.tagline}</p>
                <Link to={`/plan/${p.slug}`}>
                  <Button
                    variant={p.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Ver plan
                  </Button>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ComparisonPage;
