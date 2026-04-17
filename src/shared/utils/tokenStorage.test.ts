import { describe, it, expect, beforeEach } from 'vitest';
import { tokenStorage } from './tokenStorage';

beforeEach(() => {
  tokenStorage.clearAll();
  localStorage.clear();
});

describe('tokenStorage — access token', () => {
  it('stores and retrieves access token from memory', () => {
    tokenStorage.setAccessToken('my-token');
    expect(tokenStorage.getAccessToken()).toBe('my-token');
  });

  it('returns null before any token is set', () => {
    expect(tokenStorage.getAccessToken()).toBeNull();
  });

  it('clearAll removes the access token', () => {
    tokenStorage.setAccessToken('abc');
    tokenStorage.clearAll();
    expect(tokenStorage.getAccessToken()).toBeNull();
  });
});

describe('tokenStorage — refresh token', () => {
  it('stores and retrieves a valid refresh token', () => {
    const expiresAt = Date.now() + 60_000;
    tokenStorage.setRefreshToken('refresh-xyz', expiresAt);
    expect(tokenStorage.getRefreshToken()).toBe('refresh-xyz');
  });

  it('returns null when refresh token has expired', () => {
    const expiresAt = Date.now() - 1000; // already expired
    tokenStorage.setRefreshToken('old-token', expiresAt);
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });

  it('clearAll removes the refresh token', () => {
    tokenStorage.setRefreshToken('tok', Date.now() + 60_000);
    tokenStorage.clearAll();
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });
});
