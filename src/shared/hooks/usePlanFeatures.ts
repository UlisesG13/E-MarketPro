import { useAdminAuthStore } from '../../entities/admin/store/adminAuthStore';
import { PLAN_FEATURES, normalizePlan } from '../config/plans.config';
import type { PlanId, PlanFeatures } from '../types/common.types';

export interface UsePlanFeaturesReturn {
  currentPlan: PlanId;
  planFeatures: PlanFeatures;
  planLimits: Pick<PlanFeatures, 'maxProducts' | 'maxAdminUsers'>;
  canAddMoreProducts: (currentCount: number) => boolean;
  canAddMoreAdmins: (currentCount: number) => boolean;
  isFeatureEnabled: (feature: keyof PlanFeatures) => boolean;
}

export function usePlanFeatures(): UsePlanFeaturesReturn {
  const store = useAdminAuthStore((s) => s.store);
  const currentPlan = normalizePlan(store?.plan_id);
  const planFeatures = PLAN_FEATURES[currentPlan];

  const canAddMoreProducts = (currentCount: number): boolean => {
    const max = planFeatures.maxProducts;
    if (max === 'unlimited') return true;
    return currentCount < max;
  };

  const canAddMoreAdmins = (currentCount: number): boolean => {
    const max = planFeatures.maxAdminUsers;
    if (max === 'unlimited') return true;
    return currentCount < max;
  };

  const isFeatureEnabled = (feature: keyof PlanFeatures): boolean => {
    const value = planFeatures[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    return value === 'unlimited';
  };

  return {
    currentPlan,
    planFeatures,
    planLimits: {
      maxProducts: planFeatures.maxProducts,
      maxAdminUsers: planFeatures.maxAdminUsers,
    },
    canAddMoreProducts,
    canAddMoreAdmins,
    isFeatureEnabled,
  };
}
