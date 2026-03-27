import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Zap } from 'lucide-react';
import { usePlanStore } from '../../store/planStore';
import { planDetails } from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import Button from '../atoms/Button';

const PlanNotificationBar: React.FC = () => {
  const { selectedPlanSlug, billingPeriod, clearPlan } = usePlanStore();

  if (!selectedPlanSlug || !planDetails[selectedPlanSlug]) return null;

  const plan = planDetails[selectedPlanSlug];
  const price = billingPeriod === 'annual'
    ? Math.round(plan.price * 0.8)
    : plan.price;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40 border-b border-white/10"
        style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}15, ${plan.gradient[1]}15)`, backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}
            >
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-white">
              Plan <strong>{plan.name}</strong> seleccionado — {formatCurrency(price)}
              {billingPeriod === 'annual' ? '/mes (anual)' : '/mes'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/checkout/${selectedPlanSlug}`}>
              <Button size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Continuar
              </Button>
            </Link>
            <button
              onClick={clearPlan}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanNotificationBar;
