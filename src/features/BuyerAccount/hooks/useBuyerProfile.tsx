import { BuyerProfile } from '@/features/Authentication/types/auth';
import { get } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

const fetchProfile = async () => {
  const { data } = await get<BuyerProfile>('/buyer/profile');
  return data;
};

export function useBuyerProfile() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: fetchProfile,
  });

  return {
    buyerProfile: data,
    isLoading,
    error,
    refetchProfile: refetch,
  };
}
