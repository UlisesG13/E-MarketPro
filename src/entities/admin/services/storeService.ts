import { apiClient } from '../../../shared/services/apiClient';

// ─── Backend DTOs (matching store_schemas.py + subscription_schemas.py) ──────

export interface StoreOut {
  id: string;
  admin_id: string;
  plan_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  custom_domain: string | null;
  theme_primary_color: string;
  stripe_account_id: string | null;
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreUpdateInput {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  theme_primary_color?: string;
}

export interface PlanFeatures {
  max_products: number | null;
  max_admin_users: number | null;
  has_advanced_analytics: boolean;
  has_custom_domain: boolean;
  has_csv_import_export: boolean;
  has_extended_media: boolean;
  payment_commission_percent: number;
  payment_commission_fixed: number;
}

export interface PlanOut {
  id: string;
  name: string;
  price_monthly: number;
  max_products: number | null;
  max_admin_users: number | null;
  has_advanced_analytics: boolean;
  has_custom_domain: boolean;
  has_csv_import_export: boolean;
  has_extended_media: boolean;
  payment_commission_percent: number;
  payment_commission_fixed: number;
}

export interface StorePlanResponse {
  plan: PlanOut;
  subscription_status: string;
  subscription_expires_at: string | null;
  features: Record<string, unknown>;
}

export interface UpgradeRequest {
  plan_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

// ─── Service ──────────────────────────────────────────────

export const storeService = {
  /**
   * GET /stores/me — get authenticated admin's store
   */
  get: (): Promise<StoreOut> =>
    apiClient.get<StoreOut>('/stores/me', 'admin'),

  /**
   * PUT /stores/me — update store info
   */
  update: (data: StoreUpdateInput): Promise<StoreOut> =>
    apiClient.put<StoreOut>('/stores/me', data, 'admin'),

  /**
   * GET /stores/me/plan — get current plan + features
   */
  getPlan: (): Promise<StorePlanResponse> =>
    apiClient.get<StorePlanResponse>('/stores/me/plan', 'admin'),

  /**
   * GET /subscriptions/plans — list all available plans
   */
  getPlans: (): Promise<PlanOut[]> =>
    apiClient.get<PlanOut[]>('/subscriptions/plans'),

  /**
   * GET /subscriptions/current — current admin subscription info
   */
  getCurrentSubscription: (): Promise<unknown> =>
    apiClient.get<unknown>('/subscriptions/current', 'admin'),

  /**
   * POST /subscriptions/upgrade — start Stripe checkout for plan upgrade
   */
  subscribePlan: (
    planId: string,
    successUrl = window.location.origin + '/admin/settings',
    cancelUrl = window.location.origin + '/admin/settings'
  ): Promise<CheckoutSessionResponse> =>
    apiClient.post<CheckoutSessionResponse>(
      '/subscriptions/upgrade',
      { plan_id: planId, success_url: successUrl, cancel_url: cancelUrl },
      'admin'
    ),
};
