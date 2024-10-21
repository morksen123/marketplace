import { ErrorFallback } from '@/components/errors';
import { Toaster } from '@/components/ui/toaster';
import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AppRouter } from './router';
import { GlobalChatProvider } from '@/contexts/GlobalChatContext';

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GlobalChatProvider>
          <Suspense fallback={<div className="wrapper">Loading...</div>}>
            <ErrorBoundary fallbackRender={ErrorFallback}>
              <Toaster />
              <AppRouter />
            </ErrorBoundary>
          </Suspense>
        </GlobalChatProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

export default App;