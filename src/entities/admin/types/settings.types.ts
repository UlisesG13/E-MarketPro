// ─────────────────────────────────────────────────────────
// ADMIN SETTINGS TYPES
// ─────────────────────────────────────────────────────────

import type { AdminPlan } from './admin.types';

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  emailOnNewOrder: boolean;
  emailOnLowStock: boolean;
  emailOnNewReview: boolean;
  smsOnNewOrder: boolean;
}

export interface PaymentSettings {
  acceptCash: boolean;
  acceptCard: boolean;
  acceptTransfer: boolean;
  stripeEnabled: boolean;
  stripePublicKey?: string;
}

export interface AdminSettings {
  store: StoreSettings;
  notifications: NotificationSettings;
  payment: PaymentSettings;
  currentPlan: AdminPlan;
  planExpiresAt?: string;
}

export type UpdateSettingsInput = Partial<AdminSettings>;
