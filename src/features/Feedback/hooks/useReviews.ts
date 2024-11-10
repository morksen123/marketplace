import { handleSuccessApi } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../api/api-reviews';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // Invalidate and refetch pending reviews
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
      handleSuccessApi('Success!', 'Review submitted for order');
    },
  });
};
