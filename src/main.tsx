import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize dark mode from store
const stored = localStorage.getItem('emarketpro-ui');
if (stored) {
  try {
    const parsed = JSON.parse(JSON.parse(stored).state || '{}');
    if (parsed.darkMode !== false) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    document.documentElement.classList.add('dark');
  }
} else {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
