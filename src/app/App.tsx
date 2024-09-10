import { ErrorFallback } from '@/components/errors';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AppRouter } from './router';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Toaster />
        <AppRouter />
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
