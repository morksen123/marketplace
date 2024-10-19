import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { getAllPromotions, getPromotion, createPromotion, editPromotion, editPromotionStatus } from '../lib/promotions';
import { getProductbyProductId } from '@/features/DIstributorAccount/lib/distributor';
import { Promotion } from '../constants';
import { Product } from '@/features/ProductCatalogue/constants';

export function usePromotions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const promotionsQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await getAllPromotions();
      if (error) throw error;
      return data;
    },
  });

  const getPromotionQuery = (promotionId: number) => useQuery({
    queryKey: ['promotion', promotionId],
    queryFn: async () => {
      const { data, error } = await getPromotion(promotionId);
      if (error) throw error;
      return data;
    },
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (newPromo: Promotion) => {
      const { error } = await createPromotion(newPromo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      handleSuccessApi('Promotion Created', 'New promotion has been created successfully.');
      navigate('/distributor/promotions');
    },
    onError: (error: Error) => {
      console.log(error.message)
        handleErrorApi('Error', error.message);
    },
  });

  const editPromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Promotion }) => {
      const { error } = await editPromotion(id, data);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotion', id] });
      handleSuccessApi('Promotion Updated', 'Promotion has been updated successfully.');
      if (location.state?.from === 'product') {
        navigate(`/view-product-listing/${location.state.productId}`);
      } else {
        navigate('/distributor/promotions');
      }
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const editPromotionStatusMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Promotion }) => {
      const { error } = await editPromotionStatus(id, data);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotion', id] });
      handleSuccessApi('Promotion Updated', 'Promotion has been updated successfully.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const getPromotionProducts = async (promotion: Promotion): Promise<Product[]> => {
    if (!promotion.productIds || promotion.productIds.length === 0) {
      return [];
    }

    const productPromises = promotion.productIds.map(async (productId) => {
      const { data, error } = await getProductbyProductId(productId);
      if (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        return null;
      }
      return data;
    });

    const products = await Promise.all(productPromises);
    return products.filter((product): product is Product => product !== null);
  };

  return {
    promotions: promotionsQuery.data,
    isLoading: promotionsQuery.isLoading,
    getPromotion: getPromotionQuery,
    createPromotion: createPromotionMutation.mutate,
    editPromotion: editPromotionMutation.mutate,
    editPromotionStatus: editPromotionStatusMutation.mutate,
    getPromotionProducts,
  };
}