import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { getAllPromotions, getPromotion, createPromotion, editPromotion } from '../lib/promotions';
import { Promotion } from '../constants';

export function usePromotions() {
  const queryClient = useQueryClient();

  const promotionsQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await getAllPromotions();
      if (error) throw error;
      return data;
    },
  });

  const getPromotionQuery = (promotionId: number) => useQuery({
    queryKey: ['promotion', promotionId],
    queryFn: async () => {
      const { data, error } = await getPromotion(promotionId);
      if (error) throw error;
      return data;
    },
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (newPromo: Promotion) => {
      const { error } = await createPromotion(newPromo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      handleSuccessApi('Promotion Created', 'New promotion has been created successfully.');
    },
    onError: (error: Error) => {
      console.log(error.message)
        handleErrorApi('Error', error.message);
    },
  });

  const editPromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Promotion }) => {
      const { error } = await editPromotion(id, data);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotion', id] });
      handleSuccessApi('Promotion Updated', 'Promotion has been updated successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  return {
    promotions: promotionsQuery.data,
    isLoading: promotionsQuery.isLoading,
    getPromotion: getPromotionQuery,
    createPromotion: createPromotionMutation.mutate,
    editPromotion: editPromotionMutation.mutate,
  };
}