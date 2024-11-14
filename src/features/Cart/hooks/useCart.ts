import { Product } from '@/features/ProductListing/constants';
import { getEarliestBatchDate, isDateClose } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addItemToCart,
  CartLineItem,
  removeItemFromCart,
  updateItemQuantity,
  viewCart,
  addVoucher as addVoucherApi,
  removeVoucher as removeVoucherApi,
} from '../api/api-cart';
import { useState, useEffect } from 'react';

export const useCart = () => {
  const queryClient = useQueryClient();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const { data: cart = null } = useQuery({
    queryKey: ['cart'],
    queryFn: viewCart,
  });

  useEffect(() => {
    if (cart?.voucher) {
      setSelectedVoucher(cart.voucher);
    }
  }, [cart?.voucher]);

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

  const addVoucherMutation = useMutation({
    mutationFn: async ({ voucherCode }: { voucherCode: string }) => {
      return addVoucherApi(voucherCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeVoucherMutation = useMutation({
    mutationFn: async ({ voucherCode }: { voucherCode: string }) => {
      return removeVoucherApi(voucherCode);
    },
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

  const addVoucher = (voucherCode: string) => {
    addVoucherMutation.mutate({ voucherCode });
  };

  const removeVoucher = (voucherCode: string) => {
    removeVoucherMutation.mutate({ voucherCode });
    setSelectedVoucher(null);
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
    removeVoucher,
    addVoucher,
    cartPrice,
    cartQuantity,
    selectedVoucher,
    setSelectedVoucher,
    isShippingAddressRequired,
    cartItemsThatRequireSelfPickUp,
    cartItemsExpiringSoon,
  };
};
