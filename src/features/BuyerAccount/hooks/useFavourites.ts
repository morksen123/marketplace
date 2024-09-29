import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
import { getFavourites, checkFavourite, addFavourite, removeFavourite } from '../lib/favourites';

export function useFavourites() {
  const queryClient = useQueryClient();

  const favouritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data, error } = await getFavourites();
      if (error) throw error;
      return data;
    },
  });

  const checkFavouriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { data, error } = await checkFavourite(productId);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, productId) => {
      queryClient.setQueryData(['favorites', productId], data);
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const addFavouriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await addFavourite(productId);
      if (error) throw error;
    },
    onSuccess: (_, productId) => {
      queryClient.setQueryData(['favorites', productId], true);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      handleSuccessApi('Added to Favorites', 'Product added to your favorites.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const removeFavouriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await removeFavourite(productId);
      if (error) throw error;
    },
    onSuccess: (_, productId) => {
      queryClient.setQueryData(['favorites', productId], false);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      handleSuccessApi('Removed from Favorites', 'Product removed from your favorites.');
    },
    onError: (error: Error) => {
      handleErrorApi('Error', error.message);
    },
  });

  const toggleFavourite = async (productId: number) => {
    try {
      const isFavorited = await checkFavouriteMutation.mutateAsync(productId);
      if (isFavorited) {
        await removeFavouriteMutation.mutateAsync(productId);
      } else {
        await addFavouriteMutation.mutateAsync(productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return {
    favourites: favouritesQuery.data,
    isLoading: favouritesQuery.isLoading,
    checkFavourite: checkFavouriteMutation.mutate,
    toggleFavourite,
    addFavourite: addFavouriteMutation.mutate,
    removeFavourite: removeFavouriteMutation.mutate,
  };
}