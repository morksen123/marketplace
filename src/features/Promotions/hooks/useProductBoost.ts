import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { ProductBoostDto, UpdateProductBoostDto, getAllBoostedProducts, createProductBoost, pauseProductBoost, reactivateProductBoost, updateProductBoost } from '../lib/productboost';


export function useProductBoosts() {
  const queryClient = useQueryClient();

  const boostedProductsQuery = useQuery({
    queryKey: ['boostedProducts'],
    queryFn: async () => {
      const { data, error } = await getAllBoostedProducts();
      if (error) throw error;
      return data;
    },
  });

  const createBoostMutation = useMutation({
    mutationFn: async ({ productId, boostData }: { productId: number; boostData: ProductBoostDto }) => {
      const { error } = await createProductBoost(productId, boostData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boostedProducts'] });
      handleSuccessApi('Boost Created', 'New product boost has been created successfully.');
    },
    onError: (error: Error) => {
      console.log(error.message)
      handleErrorApi('Error', error.message);
    },
  });

  const pauseBoostMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await pauseProductBoost(productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boostedProducts'] });
      handleSuccessApi('Boost Paused', 'Product boost has been paused successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  // add reactivate here
  const reactivateBoostMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await reactivateProductBoost(productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boostedProducts'] });
      handleSuccessApi('Boost Resumed', 'Product boost has been resumed successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const updateBoostMutation = useMutation({
    mutationFn: async ({ productId, boostData }: { productId: number; boostData: ProductBoostDto  }) => {
      const { error } = await updateProductBoost(productId, boostData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boostedProducts'] });
      handleSuccessApi('Boost Updated', 'Product boost has been updated successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  return {
    boostedProducts: boostedProductsQuery.data,
    isLoading: boostedProductsQuery.isLoading,
    createBoost: createBoostMutation.mutate,
    pauseBoost: pauseBoostMutation.mutate,
    reactivateBoost: reactivateBoostMutation.mutate,
    updateBoost: updateBoostMutation.mutate,
  };
}