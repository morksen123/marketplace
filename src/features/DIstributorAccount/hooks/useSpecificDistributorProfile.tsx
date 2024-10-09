import { useQuery } from '@tanstack/react-query';
import { fetchDistributorProfile } from '../lib/distributor';

export function useDistributorProfile(distributorId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['distributorProfile', distributorId],
    queryFn: () => fetchDistributorProfile(distributorId),
  });

  return {
    distributorProfile: data,
    isLoading,
    error,
    refetchProfile: refetch,
  };
}
