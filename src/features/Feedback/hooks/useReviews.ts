import { handleSuccessApi } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReview,
  createReviewResponse,
  deleteReviewResponse,
  getProductReviews,
  updateReviewResponse,
} from '../api/api-reviews';
import { UpdateReviewResponseRequest } from '../types/review-types';

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

export const useProductReviews = (productId: number) => {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => getProductReviews(productId),
  });
};

export const useCreateReviewResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      handleSuccessApi('Success!', 'Response submitted successfully');
    },
  });
};

export const useUpdateReviewResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      data,
    }: {
      responseId: number;
      data: UpdateReviewResponseRequest;
    }) => updateReviewResponse(responseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      handleSuccessApi('Success!', 'Response updated successfully');
    },
  });
};

export const useDeleteReviewResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      handleSuccessApi('Success!', 'Response deleted successfully');
    },
  });
};
