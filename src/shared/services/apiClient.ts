export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

type RequestRole = 'admin' | 'customer' | 'public';

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

// ─── Access tokens — memory only (XSS-safe) ──────────────
let adminAccessToken: string | null = null;
let customerAccessToken: string | null = null;
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

export const tokenMemory = {
  setAdminToken: (token: string) => { adminAccessToken = token; },
  getAdminToken: () => adminAccessToken,
  clearAdminToken: () => { adminAccessToken = null; },
  setCustomerToken: (token: string) => { customerAccessToken = token; },
  getCustomerToken: () => customerAccessToken,
  clearCustomerToken: () => { customerAccessToken = null; },
  clearAll: () => { adminAccessToken = null; customerAccessToken = null; },
};

// ─── Refresh tokens — localStorage ───────────────────────
export function setRefreshToken(role: 'admin' | 'customer', token: string): void {
  const key = role === 'admin' ? 'emarketpro-admin-refresh' : 'emarketpro-customer-refresh';
  localStorage.setItem(key, token);
}

export function getRefreshToken(role: 'admin' | 'customer'): string | null {
  const key = role === 'admin' ? 'emarketpro-admin-refresh' : 'emarketpro-customer-refresh';
  return localStorage.getItem(key);
}

export function clearRefreshToken(role: 'admin' | 'customer'): void {
  const key = role === 'admin' ? 'emarketpro-admin-refresh' : 'emarketpro-customer-refresh';
  localStorage.removeItem(key);
}

function getStoreId(): string | null {
  try {
    const raw = localStorage.getItem('emarketpro-admin-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { store?: { id?: string } } };
    return parsed?.state?.store?.id ?? null;
  } catch {
    return null;
  }
}

async function attemptRefresh(role: 'admin' | 'customer'): Promise<boolean> {
  const refreshToken = getRefreshToken(role);
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      clearRefreshToken(role);
      tokenMemory.clearAll();
      return false;
    }

    const data = await response.json() as { access_token: string; refresh_token: string };
    if (role === 'admin') {
      tokenMemory.setAdminToken(data.access_token);
    } else {
      tokenMemory.setCustomerToken(data.access_token);
    }
    setRefreshToken(role, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  role: RequestRole = 'public'
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (role === 'admin') {
    const token = tokenMemory.getAdminToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const storeId = getStoreId();
    if (storeId) headers['X-Store-ID'] = storeId;
  } else if (role === 'customer') {
    const token = tokenMemory.getCustomerToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && role !== 'public') {
    if (isRefreshing) {
      await new Promise<void>((resolve) => { pendingRequests.push(resolve); });
      return request<T>(method, path, body, role);
    }

    isRefreshing = true;
    const refreshed = await attemptRefresh(role as 'admin' | 'customer');
    isRefreshing = false;
    pendingRequests.forEach((resolve) => resolve());
    pendingRequests = [];

    if (refreshed) return request<T>(method, path, body, role);

    tokenMemory.clearAll();
    window.location.href = '/login';
    throw new ApiError(401, 'Sesión expirada. Por favor inicia sesión nuevamente.');
  }

  if (!response.ok) {
    let detail = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json() as { detail?: string | Array<{ msg: string }> };
      if (typeof errorData.detail === 'string') {
        detail = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        detail = errorData.detail.map((e) => e.msg).join(', ');
      }
    } catch { /* keep generic detail */ }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  get:    <T>(path: string, role?: RequestRole) => request<T>('GET', path, undefined, role),
  post:   <T>(path: string, body: unknown, role?: RequestRole) => request<T>('POST', path, body, role),
  put:    <T>(path: string, body: unknown, role?: RequestRole) => request<T>('PUT', path, body, role),
  patch:  <T>(path: string, body: unknown, role?: RequestRole) => request<T>('PATCH', path, body, role),
  delete: <T>(path: string, role?: RequestRole) => request<T>('DELETE', path, undefined, role),
};
