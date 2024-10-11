import React from 'react';
import { CartLineItem } from '../api/api-cart';
import { useCart } from '../hooks/useCart';

export const SelfPickupItems: React.FC = () => {
  const { cartItemsThatRequireSelfPickUp, cartItemsExpiringSoon } = useCart();

  if (
    (!cartItemsThatRequireSelfPickUp ||
      cartItemsThatRequireSelfPickUp.length === 0) &&
    (!cartItemsExpiringSoon || cartItemsExpiringSoon.length === 0)
  ) {
    return null;
  }

  const formatItemList = (items: CartLineItem[] | undefined): string => {
    if (!items || items.length === 0) return '';
    const itemTitles = items.map((item) => item.product.listingTitle);
    if (itemTitles.length === 1) {
      return `${itemTitles[0]}`;
    } else {
      const lastItem = itemTitles.pop();
      return `${itemTitles.join(', ')} and ${lastItem}`;
    }
  };

  const selfPickupText =
    cartItemsThatRequireSelfPickUp && cartItemsThatRequireSelfPickUp.length > 0
      ? `${formatItemList(cartItemsThatRequireSelfPickUp)} ${
          cartItemsThatRequireSelfPickUp.length === 1 ? 'is a' : 'are'
        } self pick-up item${
          cartItemsThatRequireSelfPickUp.length === 1 ? '' : 's'
        }.`
      : '';

  const expiringText =
    cartItemsExpiringSoon && cartItemsExpiringSoon.length > 0
      ? `${formatItemList(cartItemsExpiringSoon)} ${
          cartItemsExpiringSoon.length === 1 ? 'is' : 'are'
        } expiring soon.`
      : '';

  return (
    <div className="text-secondary text-xs mt-1">
      {selfPickupText && <p>{selfPickupText}</p>}
      {expiringText && <p className="mt-1">{expiringText}</p>}
    </div>
  );
};
