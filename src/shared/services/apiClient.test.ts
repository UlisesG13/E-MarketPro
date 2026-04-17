import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiClient, ApiError, tokenMemory } from './apiClient';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

beforeEach(() => {
  mockFetch.mockReset();
  tokenMemory.clearAll();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('apiClient — Authorization header', () => {
  it('adds Bearer token when role is admin and token exists', async () => {
    tokenMemory.setAdminToken('admin-tok');
    mockFetch.mockReturnValue(mockResponse({ ok: true }));

    await apiClient.get('/test', 'admin');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer admin-tok');
  });

  it('does not add Authorization for public requests', async () => {
    tokenMemory.setAdminToken('some-token');
    mockFetch.mockReturnValue(mockResponse([]));

    await apiClient.get('/public', 'public');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });
});

describe('apiClient — X-Store-ID header', () => {
  it('adds X-Store-ID for admin requests when storeId is in localStorage', async () => {
    localStorage.setItem(
      'emarketpro-admin-auth',
      JSON.stringify({ state: { store: { id: 'store-99' } } })
    );
    tokenMemory.setAdminToken('tok');
    mockFetch.mockReturnValue(mockResponse({}));

    await apiClient.get('/admin/products', 'admin');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['X-Store-ID']).toBe('store-99');
  });
});

describe('apiClient — ApiError', () => {
  it('throws ApiError with status and detail on non-ok responses', async () => {
    mockFetch.mockReturnValue(mockResponse({ detail: 'Not found' }, 404));

    await expect(apiClient.get('/missing', 'public')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      detail: 'Not found',
    });
  });

  it('ApiError is instance of Error', async () => {
    mockFetch.mockReturnValue(mockResponse({ detail: 'Forbidden' }, 403));

    try {
      await apiClient.get('/secret', 'public');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(ApiError);
    }
  });
});
