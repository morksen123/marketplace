import { get, post, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/ProductCatalogue/constants';

export interface ProductBoostDto {
  startDate: string;
  endDate: string;
}

export interface UpdateProductBoostDto {
    endDate: string;
}
  

export const getAllBoostedProducts = async (): Promise<
  ApiResponse<Product[]>
> => {
  return get<Product[]>('/products/distributor/boosted');
};

export const createProductBoost = async (
  productId: number,
  boostData: ProductBoostDto,
): Promise<ApiResponse<Product>> => {
  return post<Product>(`/products/product/${productId}/boost`, boostData);
};

export const pauseProductBoost = async (
  productId: number,
): Promise<ApiResponse<Product>> => {
  return put<Product>(`/products/product/${productId}/boost/pause`, {});
};

export const reactivateProductBoost = async (
  productId: number,
): Promise<ApiResponse<Product>> => {
  return put<Product>(`/products/product/${productId}/boost/reactivate`, {});
};

export const updateProductBoost = async (
  productId: number,
  boostData: UpdateProductBoostDto,
): Promise<ApiResponse<Product>> => {
  return put<Product>(`/products/product/${productId}/boost/update`, boostData);
};
