import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './queryClient';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--app-surface-strong)',
            border: '1px solid var(--app-border)',
            color: 'var(--app-text)',
            fontSize: '14px',
            boxShadow: 'var(--app-shadow)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
