import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkRatingEligibility,
  createPlatformReview,
} from '../api/api-reviews';
import { CreatePlatformRatingRequest } from '../types/review-types';

export const platformRatingKeys = {
  all: ['platformRating'] as const,
  eligibility: () => [...platformRatingKeys.all, 'eligibility'] as const,
  list: () => [...platformRatingKeys.all, 'list'] as const,
  detail: (id: number) => [...platformRatingKeys.all, 'detail', id] as const,
};

export const usePlatformRatingEligibility = () => {
  return useQuery({
    queryKey: platformRatingKeys.eligibility(),
    queryFn: checkRatingEligibility,
  });
};

export const useCreatePlatformRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlatformRatingRequest) =>
      createPlatformReview(data),
    onSuccess: () => {
      // Invalidate eligibility query after successful submission
      queryClient.invalidateQueries({
        queryKey: platformRatingKeys.eligibility(),
      });
    },
  });
};
