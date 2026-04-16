// ─────────────────────────────────────────────────────────
// API CLIENT — Base HTTP client for all API calls
// ─────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// ─── Token management ────────────────────────────────────

function getAdminToken(): string | null {
  try {
    const raw = localStorage.getItem('emarketpro-admin-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

function getCustomerToken(): string | null {
  try {
    const raw = localStorage.getItem('emarketpro-customer-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

// ─── Request builder ─────────────────────────────────────

type RequestRole = 'admin' | 'customer' | 'public';

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  role: RequestRole = 'public'
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (role === 'admin') {
    const token = getAdminToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } else if (role === 'customer') {
    const token = getCustomerToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Error desconocido');
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}

// ─── Exported HTTP methods ────────────────────────────────

export const apiClient = {
  get: <T>(path: string, role?: RequestRole) => request<T>('GET', path, undefined, role),
  post: <T>(path: string, body: unknown, role?: RequestRole) => request<T>('POST', path, body, role),
  put: <T>(path: string, body: unknown, role?: RequestRole) => request<T>('PUT', path, body, role),
  patch: <T>(path: string, body: unknown, role?: RequestRole) => request<T>('PATCH', path, body, role),
  delete: <T>(path: string, role?: RequestRole) => request<T>('DELETE', path, undefined, role),
};

export { BASE_URL };
