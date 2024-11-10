import { get, post } from '@/lib/api-client';
import {
  CreatePlatformRatingRequest,
  CreateReviewDTO,
  ProductReviewDTO,
  RatingEligibility,
} from '../types/review-types';

export async function createReview(data: CreateReviewDTO) {
  await post<ProductReviewDTO>('/reviews/create', data);
}

export async function createPlatformReview(data: CreatePlatformRatingRequest) {
  await post('/platform-ratings', data);
}

export async function checkRatingEligibility() {
  const { data } = await get('/platform-ratings/eligibility');
  return data as RatingEligibility;
}
