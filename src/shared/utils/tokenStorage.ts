// ─────────────────────────────────────────────────────────
// TOKEN STORAGE
// Access tokens live in memory only (XSS-safe).
// Refresh tokens are persisted in localStorage with expiry.
//
// Migration path to httpOnly cookies:
//   1. Remove setRefreshToken / getRefreshToken from here.
//   2. Let the backend set the refresh token as a Set-Cookie header
//      with HttpOnly + SameSite=Strict flags.
//   3. The browser sends it automatically on /auth/refresh calls.
//   4. Remove credentials from localStorage entirely.
// ─────────────────────────────────────────────────────────

const REFRESH_KEY = 'emarketpro-refresh-token';
const REFRESH_EXPIRY_KEY = 'emarketpro-refresh-expiry';

class TokenStorage {
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  setRefreshToken(token: string, expiresAt: number): void {
    try {
      localStorage.setItem(REFRESH_KEY, token);
      localStorage.setItem(REFRESH_EXPIRY_KEY, String(expiresAt));
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  }

  getRefreshToken(): string | null {
    try {
      const expiry = localStorage.getItem(REFRESH_EXPIRY_KEY);
      if (expiry && Date.now() > Number(expiry)) {
        this.clearRefreshToken();
        return null;
      }
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  }

  clearRefreshToken(): void {
    try {
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(REFRESH_EXPIRY_KEY);
    } catch {
      // ignore
    }
  }

  clearAll(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
  }
}

export const tokenStorage = new TokenStorage();
