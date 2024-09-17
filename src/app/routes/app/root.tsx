import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router-dom';

export const AppRoot: React.FC = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<div className="wrapper">Loading...</div>}>
      <ErrorBoundary
        key={location.pathname}
        fallback={<div>Something went wrong!</div>}
      >
        <Outlet />
      </ErrorBoundary>
    </Suspense>
  );
};
