// ─────────────────────────────────────────────────────────
// APP CONSTANTS
// ─────────────────────────────────────────────────────────

export const APP_NAME = 'E-MarketPro';
export const APP_VERSION = '2.0.0';

// ─── API ─────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// ─── Admin Routes ─────────────────────────────────────────
export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  FINANCIAL: '/financial',
  SETTINGS: '/settings',
  CHECKOUT: (planId: string) => `/checkout/${planId}`,
} as const;

// ─── Customer Routes ──────────────────────────────────────
export const CUSTOMER_ROUTES = {
  STORE: '/store',
  PRODUCT: (id: string) => `/store/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout-store',
  ORDER_SUCCESS: '/order-success',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  SEARCH: '/search',
  CATEGORY: (slug: string) => `/category/${slug}`,
  FAVORITES: '/favorites',
} as const;

// ─── Public Routes ────────────────────────────────────────
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NOT_FOUND: '/404',
  ERROR: '/error',
  PLAN_DETAIL: (planId: string) => `/plan/${planId}`,
  COMPARE: '/comparar',
} as const;

// ─── Local Storage Keys ───────────────────────────────────
export const STORAGE_KEYS = {
  ADMIN_AUTH: 'emarketpro-admin-auth',
  CUSTOMER_AUTH: 'emarketpro-customer-auth',
  CART: 'emarketpro-cart',
  FAVORITES: 'emarketpro-favorites',
  UI: 'emarketpro-ui',
  NOTIFICATIONS: 'emarketpro-notifications',
} as const;
