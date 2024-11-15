import { del, get, post, put } from '@/lib/api-client';
import {
  CreatePlatformRatingRequest,
  CreateReviewDTO,
  CreateReviewResponseRequest,
  DistributorAnalytics,
  ProductReviewDTO,
  RatingEligibility,
  ReviewResponseDTO,
  UpdateReviewResponseRequest,
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

export async function getProductReviews(productId: number) {
  const { data } = await get(`/reviews/product/${productId}`);
  return data as ProductReviewDTO[];
}

export async function createReviewResponse(data: CreateReviewResponseRequest) {
  const { data: response } = await post<ReviewResponseDTO>(
    '/review-responses',
    data,
  );
  return response;
}

export async function updateReviewResponse(
  responseId: number,
  data: UpdateReviewResponseRequest,
) {
  const { data: response } = await put<ReviewResponseDTO>(
    `/review-responses/${responseId}`,
    data,
  );
  return response;
}

export async function deleteReviewResponse(responseId: number) {
  await del(`/review-responses/${responseId}`);
}

export async function getDistributorAnalytics() {
  const { data } = await get<DistributorAnalytics>(
    '/reviews/analytics/distributor',
  );
  return data;
}
