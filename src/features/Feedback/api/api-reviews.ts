import { post } from '@/lib/api-client';
import { CreateReviewDTO, ProductReviewDTO } from '../types/review-types';

export async function createReview(data: CreateReviewDTO) {
  console.log(data);
  await post<ProductReviewDTO>('/reviews/create', data);
}
