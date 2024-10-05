import { Product } from '@/features/ProductListing/constants';
import { calculatePromotionalDiscount } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  addItemToCart,
  CartLineItem,
  removeItemFromCart,
  updateItemQuantity,
  viewCart,
} from '../api/api-cart';

export const useCart = () => {
  const queryClient = useQueryClient();

  const calculateCartItemPrice = (cartItem: CartLineItem) => {
    const bulkPricings = cartItem.product.bulkPricings;

    const applicableBulkPricing = bulkPricings?.find(
      (pricing) =>
        cartItem.quantity >= pricing.minQuantity &&
        cartItem.quantity <= pricing.maxQuantity,
    )?.price;

    const itemPrice = applicableBulkPricing || cartItem.product.price;

    const discount = calculatePromotionalDiscount(cartItem.product);

    const discountedPrice = (itemPrice * (100 - discount)) / 100;

    const roundedPrice = Math.round(discountedPrice * 100) / 100; // 2 dp

    return roundedPrice;
  };

  const { data: originalCart = null } = useQuery({
    queryKey: ['cart'],
    queryFn: viewCart,
  });

  const cart = useMemo(() => {
    if (!originalCart) return null;

    const cartLineItems = originalCart.cartLineItems.map((cartItem) => ({
      ...cartItem,
      price: calculateCartItemPrice(cartItem), // update cart item price
    }));

    return {
      ...originalCart,
      cartLineItems,
    };
  }, [originalCart]);

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

  const isShippingAddressRequired = cart?.cartLineItems.some(
    (item) => item.product.deliveryMethod === 'DOORSTEP_DELIVERY',
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartPrice,
    cartQuantity,
    isShippingAddressRequired,
    calculateCartItemPrice,
  };
};
