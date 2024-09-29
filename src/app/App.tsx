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
    <JotaiProvider>
      <GlobalChatProvider>
        <Suspense fallback={<div className="wrapper">Loading...</div>}>
          <ErrorBoundary fallbackRender={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <AppRouter />
            </QueryClientProvider>
          </ErrorBoundary>
        </Suspense>
      </GlobalChatProvider>
    </JotaiProvider>
  );
}

export default App;