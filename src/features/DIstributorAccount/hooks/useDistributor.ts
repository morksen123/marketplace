import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { getDistributorProfile, updateDistributorProfile, getAllProductsByDistributor, getAllActiveProductsByDistributor, getProductbyProductId } from '../lib/distributor';


interface Distributor {
  distributorId: number;
  distributorName: string;
  address: number;
  email: string;
  name: string;
  contactName: string;
  warehouseAddress: number;
  isApproved: Boolean;
}

export function useDistributor() {
  const queryClient = useQueryClient();

  const distributorProfileQuery = useQuery({
    queryKey: ['distributorProfile'],
    queryFn: async () => {
      const { data, error } = await getDistributorProfile();
      if (error) throw error;
      return data;
    },
  });

  const updateDistributorProfileMutation = useMutation({
    mutationFn: async (updatedDistributor: Partial<Distributor>) => {
      const { error } = await updateDistributorProfile(updatedDistributor);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributorProfile'] });
      handleSuccessApi('Profile Updated', 'Your profile has been updated successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const getProductQuery = (productId: number) => useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await getProductbyProductId(productId);
      if (error) throw error;
      return data;
    },
  });

  const allProductsQuery = useQuery({
    queryKey: ['allDistributorProducts'],
    queryFn: async () => {
      const { data, error } = await getAllProductsByDistributor();
      if (error) throw error;
      return data;
    },
  });

  const activeProductsQuery = useQuery({
    queryKey: ['activeDistributorProducts'],
    queryFn: async () => {
      const { data, error } = await getAllActiveProductsByDistributor();
      if (error) throw error;
      return data;
    },
  });

  return {
    distributorProfile: distributorProfileQuery.data,
    isLoadingProfile: distributorProfileQuery.isLoading,
    updateDistributorProfile: updateDistributorProfileMutation.mutate,
    allProducts: allProductsQuery.data,
    isLoadingAllProducts: allProductsQuery.isLoading,
    activeProducts: activeProductsQuery.data,
    isLoadingActiveProducts: activeProductsQuery.isLoading,
    getProduct: getProductQuery
  };
}