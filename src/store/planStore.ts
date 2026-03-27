import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlanState {
  selectedPlanSlug: string | null;
  billingPeriod: 'monthly' | 'annual';
  selectPlan: (slug: string) => void;
  clearPlan: () => void;
  setBillingPeriod: (period: 'monthly' | 'annual') => void;
  toggleBillingPeriod: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      selectedPlanSlug: null,
      billingPeriod: 'monthly',
      selectPlan: (slug: string) => set({ selectedPlanSlug: slug }),
      clearPlan: () => set({ selectedPlanSlug: null }),
      setBillingPeriod: (period: 'monthly' | 'annual') => set({ billingPeriod: period }),
      toggleBillingPeriod: () =>
        set({ billingPeriod: get().billingPeriod === 'monthly' ? 'annual' : 'monthly' }),
    }),
    { name: 'emarketpro-plan' }
  )
);
