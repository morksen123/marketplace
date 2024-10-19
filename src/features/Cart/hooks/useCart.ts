import { Product } from '@/features/ProductListing/constants';
import { getEarliestBatchDate, isDateClose } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addItemToCart,
  CartLineItem,
  removeItemFromCart,
  updateItemQuantity,
  viewCart,
} from '../api/api-cart';

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart = null } = useQuery({
    queryKey: ['cart'],
    queryFn: viewCart,
  });

  const addToCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addItemToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateItemQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addToCart = (product: Product, quantity: number) => {
    addToCartMutation.mutate({ productId: product.productId, quantity });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const quantityToAdd = Math.max(0, quantity);
    updateQuantityMutation.mutate({ productId, quantity: quantityToAdd });
  };

  const removeFromCart = (productId: string) => {
    removeFromCartMutation.mutate(productId);
  };

  const cartPrice =
    cart?.cartLineItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ) ?? 0;

  const cartQuantity =
    cart?.cartLineItems.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const isItemExpiringSoon = (item: CartLineItem): boolean => {
    const earliestBatchDate = getEarliestBatchDate(item.product.batches);
    return earliestBatchDate ? isDateClose(earliestBatchDate) : false;
  };

  const isShippingAddressRequired = cart?.cartLineItems.some(
    (item) =>
      item.product.deliveryMethod === 'DOORSTEP_DELIVERY' &&
      !isItemExpiringSoon(item),
  );

  const cartItemsExpiringSoon = cart?.cartLineItems.filter(isItemExpiringSoon);

  const cartItemsThatRequireSelfPickUp = cart?.cartLineItems.filter(
    (item) =>
      item.product.deliveryMethod !== 'DOORSTEP_DELIVERY' ||
      isItemExpiringSoon(item),
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartPrice,
    cartQuantity,
    isShippingAddressRequired,
    cartItemsThatRequireSelfPickUp,
    cartItemsExpiringSoon,
  };
};
