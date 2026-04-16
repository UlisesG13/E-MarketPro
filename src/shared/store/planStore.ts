import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanDetail } from '../types/common.types';

type BillingPeriod = 'monthly' | 'yearly' | 'annual';

interface PlanState {
  selectedPlan: PlanDetail | null;
  selectedPlanSlug: string | null;
  billingPeriod: BillingPeriod;
  setSelectedPlan: (plan: PlanDetail | null) => void;
  selectPlan: (slug: string) => void;
  toggleBillingPeriod: () => void;
  clearPlan: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      selectedPlan: null,
      selectedPlanSlug: null,
      billingPeriod: 'monthly',

      setSelectedPlan: (plan) => set({ selectedPlan: plan, selectedPlanSlug: plan?.slug ?? null }),

      selectPlan: (slug) => set({ selectedPlanSlug: slug }),

      toggleBillingPeriod: () =>
        set({ billingPeriod: get().billingPeriod === 'monthly' ? 'yearly' : 'monthly' }),

      clearPlan: () => set({ selectedPlan: null, selectedPlanSlug: null }),
    }),
    { name: 'emarketpro-plan' }
  )
);
