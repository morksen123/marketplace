import { get, put } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface Favourite {
  productId: number;
  listingTitle: string;
  productPictures: string[];
  foodCategory: string;
  foodCondition: string;
  // Add other properties of a favorite item if any
}

export const getFavourites = async (): Promise<ApiResponse<Favourite[]>> => {
  return get<Favourite[]>('/buyer/favourites');
};

export const checkFavourite = async (
  productId: number,
): Promise<ApiResponse<boolean>> => {
  return get<boolean>(`/buyer/favourites/check?productId=${productId}`);
};

export const addFavourite = async (
  productId: number,
): Promise<ApiResponse<void>> => {
  return put<void>(`/buyer/favourites/${productId}/add`, {});
};

export const removeFavourite = async (
  productId: number,
): Promise<ApiResponse<void>> => {
  return put<void>(`/buyer/favourites/${productId}/remove`, {});
};
