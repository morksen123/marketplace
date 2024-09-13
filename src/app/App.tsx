import { ErrorFallback } from '@/components/errors';
import { Toaster } from '@/components/ui/toaster';
import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AppRouter } from './router';

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <Toaster />
            <AppRouter />
          </JotaiProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
