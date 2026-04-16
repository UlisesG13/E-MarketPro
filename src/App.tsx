import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { router } from './lib/router';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
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

export default App;
