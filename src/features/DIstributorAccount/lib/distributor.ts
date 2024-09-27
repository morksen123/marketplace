import { get, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
// import { Distributor, Product} from '../constants';
import { Distributor } from '@/features/Home/constants';
import { Product } from '@/features/ProductCatalogue/constants';

export const getDistributorProfile = async (): Promise<ApiResponse<Distributor>> => {
  return get<Distributor>('/distributor/profile');
};

export const updateDistributorProfile = async (
  updatedDistributor: Partial<Distributor>
): Promise<ApiResponse<Distributor>> => {
  return put<Distributor>('/distributor/profile/update', updatedDistributor);
};

export const getAllProductsByDistributor = async (): Promise<ApiResponse<Product[]>> => {
  return get<Product[]>('/products/distributor');
};

export const getAllActiveProductsByDistributor = async (): Promise<ApiResponse<Product[]>> => {
  return get<Product[]>('/products/distributor/active');
};