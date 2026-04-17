import type { PlanId, PlanFeatures } from '../types/common.types';

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  basic: {
    maxProducts: 100,
    maxAdminUsers: 1,
    hasAdvancedAnalytics: false,
    hasCustomDomain: false,
    hasPrioritySupport: false,
    hasCSVImportExport: false,
    hasExtendedMediaStorage: false,
    paymentCommissionPercent: 2.9,
    paymentCommissionFixed: 5,
  },
  pro: {
    maxProducts: 'unlimited',
    maxAdminUsers: 5,
    hasAdvancedAnalytics: true,
    hasCustomDomain: true,
    hasPrioritySupport: true,
    hasCSVImportExport: false,
    hasExtendedMediaStorage: false,
    paymentCommissionPercent: 1.9,
    paymentCommissionFixed: 3,
  },
  enterprise: {
    maxProducts: 'unlimited',
    maxAdminUsers: 'unlimited',
    hasAdvancedAnalytics: true,
    hasCustomDomain: true,
    hasPrioritySupport: true,
    hasCSVImportExport: true,
    hasExtendedMediaStorage: true,
    paymentCommissionPercent: 0.9,
    paymentCommissionFixed: 2,
  },
};

// Maps the AdminPlan string from the backend to a PlanId
export function normalizePlan(plan: string | undefined | null): PlanId {
  if (plan === 'pro') return 'pro';
  if (plan === 'enterprise') return 'enterprise';
  return 'basic';
}
