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

  const defaultShippingAddress = data?.shippingAddresses.find(
    (address) => address.isDefaultShippingAddress,
  );
  const defaultBillingAddress = data?.shippingAddresses.find(
    (address) => address.isDefaultBillingAddress,
  );

  return {
    buyerProfile: data,
    isLoading,
    error,
    refetchProfile: refetch,
    defaultShippingAddress,
    defaultBillingAddress,
  };
}
