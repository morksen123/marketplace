import { ErrorFallback } from '@/components/errors';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { AppRouter } from './router';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <AppRouter />
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
