import type { ReactNode } from 'react';
import { usePlanFeatures } from '../../hooks/usePlanFeatures';
import type { PlanFeatures } from '../../types/common.types';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function FeatureGate({ feature, fallback = null, children }: FeatureGateProps) {
  const { isFeatureEnabled } = usePlanFeatures();
  return isFeatureEnabled(feature) ? <>{children}</> : <>{fallback}</>;
}
