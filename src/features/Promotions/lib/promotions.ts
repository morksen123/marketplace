import { get, post, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Promotion } from '../constants';

// API endpoints not updated

export const getAllPromotions = async (): Promise<ApiResponse<Promotion[]>> => {
  return get<Promotion[]>('/promotions/distributor');
};

export const getPromotion = async (
  promotionId: number,
): Promise<ApiResponse<Promotion>> => {
  return get<Promotion>(`/promotions/promotion/${promotionId}`);
};

export const createPromotion = async (
  newPromo: Partial<Promotion>,
): Promise<ApiResponse<void>> => {
  return post<void>('/promotions/create', newPromo);
};

export const editPromotion = async (
  promotionId: number,
  editedPromo: Promotion,
): Promise<ApiResponse<void>> => {
  return put<void>(`/promotions/promotion/${promotionId}`, editedPromo);
};

export const editPromotionStatus = async (
  promotionId: number,
  editedPromo: Promotion,
): Promise<ApiResponse<void>> => {
  return put<void>(`/promotions/promotion/${promotionId}/status`, editedPromo);
};
