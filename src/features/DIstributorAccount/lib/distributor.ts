import { Product } from '@/features/ProductCatalogue/constants';
import { get, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface Distributor {
  distributorId: number;
  distributorName: string;
  address: number;
  email: string;
  username: string;
  contactName: string;
  contactNumber: string;
  warehouseAddress: number;
  isApproved: boolean;
  boostCount: number;
}

export const getDistributorProfile = async (): Promise<
  ApiResponse<Distributor>
> => {
  return get<Distributor>('/distributor/profile');
};

export const updateDistributorProfile = async (
  updatedDistributor: Partial<Distributor>,
): Promise<ApiResponse<Distributor>> => {
  return put<Distributor>('/distributor/profile/update', updatedDistributor);
};

export const getAllProductsByDistributor = async (): Promise<
  ApiResponse<Product[]>
> => {
  return get<Product[]>('/products/distributor');
};

export const getAllActiveProductsByDistributor = async (): Promise<
  ApiResponse<Product[]>
> => {
  return get<Product[]>('/products/distributor/active');
};

export const getProductbyProductId = async (
  productId: number,
): Promise<ApiResponse<Product>> => {
  return get<Product>(`/products/product/${productId}`);
};

export const fetchDistributorProfile = async (distributorId: number) => {
  const { data } = await get<Distributor>(
    `/distributor/admin/${distributorId}`,
  );
  return data;
};
