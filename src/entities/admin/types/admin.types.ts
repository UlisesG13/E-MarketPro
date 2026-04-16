// ─────────────────────────────────────────────────────────
// ADMIN TYPES — Tipos del Administrador / Vendedor
// ─────────────────────────────────────────────────────────

export type AdminPlan = 'free' | 'pro' | 'enterprise';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'seller';
  storeId: string;
  plan: AdminPlan;
  createdAt: string;
}

export interface StoreTheme {
  primaryColor: string;
  logo: string;
  banner: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  theme: StoreTheme;
  plan: AdminPlan;
  createdAt: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
  store: Store;
}
