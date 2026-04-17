// ─────────────────────────────────────────────────────────
// QUERY KEYS — centralized TanStack Query key factory
// ─────────────────────────────────────────────────────────

export const queryKeys = {
  products: {
    all: (storeId: string) => ['products', storeId] as const,
    byId: (storeId: string, id: string) => ['products', storeId, id] as const,
    count: (storeId: string) => ['products', storeId, 'count'] as const,
  },
  orders: {
    all: (storeId: string) => ['orders', storeId] as const,
    byId: (storeId: string, id: string) => ['orders', storeId, id] as const,
  },
  analytics: {
    dashboard: (storeId: string) => ['analytics', storeId, 'dashboard'] as const,
    financial: (storeId: string, period: string) => ['analytics', storeId, 'financial', period] as const,
  },
  customer: {
    profile: (customerId: string) => ['customer', customerId, 'profile'] as const,
    orders: (customerId: string) => ['customer', customerId, 'orders'] as const,
    cart: () => ['cart'] as const,
  },
} as const;
