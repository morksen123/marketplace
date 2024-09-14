import { useQuery } from '@tanstack/react-query';

import { checkAuth } from '@/lib/auth';

export function useAuthStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['authCheck'],
    queryFn: checkAuth,
  });

  return {
    isAuthenticated: data,
    isLoading: isLoading,
    error: error,
  };
}
