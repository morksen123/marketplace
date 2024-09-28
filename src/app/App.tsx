import { ErrorFallback } from '@/components/errors';
import { Toaster } from '@/components/ui/toaster';
import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AppRouter } from './router';
import { useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import { GlobalChatProvider } from '@/contexts/GlobalChatContext';

function App() {
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await WebSocketService.connect();
        console.log('WebSocket connected');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    };

    initializeWebSocket();

    return () => {
      WebSocketService.disconnect();
    };
  }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <GlobalChatProvider>
      <Suspense fallback={<div className="wrapper">Loading...</div>}>
        <ErrorBoundary fallbackRender={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <JotaiProvider>
              <Toaster />
              <AppRouter />
            </JotaiProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </Suspense>
    </GlobalChatProvider>
  );
}

export default App;