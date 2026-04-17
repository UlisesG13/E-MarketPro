import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { usePlanFeatures } from '../../hooks/usePlanFeatures';

const PLAN_LABELS: Record<string, string> = {
  basic: 'Pro',
  pro: 'Enterprise',
  enterprise: 'Enterprise',
};

interface UpgradeBannerProps {
  message?: string;
}

export default function UpgradeBanner({ message }: UpgradeBannerProps) {
  const navigate = useNavigate();
  const { currentPlan } = usePlanFeatures();
  const targetPlan = PLAN_LABELS[currentPlan] ?? 'Pro';
  const displayMessage = message ?? `Esta función requiere el plan ${targetPlan}. Actualiza tu plan.`;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--app-primary-soft)] bg-[var(--app-primary-soft)]/20 px-4 py-3">
      <Zap className="w-4 h-4 shrink-0 text-[var(--app-primary)]" />
      <p className="flex-1 text-sm text-[var(--app-text-muted)]">{displayMessage}</p>
      <button
        type="button"
        onClick={() => navigate('/comparar')}
        className="shrink-0 rounded-lg bg-[var(--app-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
      >
        Actualizar
      </button>
    </div>
  );
}
