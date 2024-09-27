import { get, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/ProductCatalogue/constants';


interface Distributor {
  distributorId: number;
  distributorName: string;
  address: number;
  email: string;
  name: string;
  contactName: string;
  warehouseAddress: number;
  isApproved: Boolean;
}

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