import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { tokenMemory } from './shared/services/apiClient';

// ─── Dark mode initialization ────────────────────────────
const stored = localStorage.getItem('emarketpro-ui');
if (stored) {
  try {
    const parsed = JSON.parse(JSON.parse(stored).state || '{}') as { darkMode?: boolean };
    if (parsed.darkMode !== false) document.documentElement.classList.add('dark');
  } catch {
    document.documentElement.classList.add('dark');
  }
} else {
  document.documentElement.classList.add('dark');
}

// ─── Silent token refresh on page reload ─────────────────
async function initializeAuth(): Promise<void> {
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

  const adminRefresh = localStorage.getItem('emarketpro-admin-refresh');
  if (adminRefresh) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: adminRefresh }),
      });
      if (res.ok) {
        const data = await res.json() as { access_token: string; refresh_token: string };
        tokenMemory.setAdminToken(data.access_token);
        localStorage.setItem('emarketpro-admin-refresh', data.refresh_token);
      } else {
        localStorage.removeItem('emarketpro-admin-refresh');
      }
    } catch {
      localStorage.removeItem('emarketpro-admin-refresh');
    }
  }

  const customerRefresh = localStorage.getItem('emarketpro-customer-refresh');
  if (customerRefresh) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: customerRefresh }),
      });
      if (res.ok) {
        const data = await res.json() as { access_token: string; refresh_token: string };
        tokenMemory.setCustomerToken(data.access_token);
        localStorage.setItem('emarketpro-customer-refresh', data.refresh_token);
      } else {
        localStorage.removeItem('emarketpro-customer-refresh');
      }
    } catch {
      localStorage.removeItem('emarketpro-customer-refresh');
    }
  }
}

initializeAuth().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
