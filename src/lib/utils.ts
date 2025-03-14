import { RoleTypes } from '@/features/Authentication/types/auth';
import { Address } from '@/features/BuyerAccount/hooks/useAddress';
import { Batch, Product } from '@/features/ProductListing/constants';
import { StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Cookies from 'universal-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;
  
  // Split by underscore and filter out empty strings
  const words = str.split('_').filter(word => word.length > 0);
  
  // Capitalize each word and join with space
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getUserRoleFromCookie() {
  const cookies = new Cookies();
  const userRole = cookies.get('user_role');
  return userRole as RoleTypes;
}

export function formatDisplayDate(dateString: string) {
  if (!dateString) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options); // en-GB for British date formatting
}

export const calculatePromotionalDiscount = (product: Product): number => {
  if (!product.promotions || product.promotions.length === 0) return 0;

  const activePromotions = product.promotions.filter(
    (promo) => promo.status === 'ACTIVE',
  );

  if (activePromotions.length === 0) return 0;

  // Apply the highest discount
  return Math.max(...activePromotions.map((promo) => promo.discountPercentage));
};

export const isDateClose = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 2 && diffDays >= 0;
};

export function getEarliestBatchDate(batches?: Batch[]): string | null {
  if (!batches || batches.length === 0) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  const validBatches = batches.filter((batch) => {
    const batchDate = new Date(batch.bestBeforeDate);
    return batch.isActive && batch.quantity > 0 && batchDate >= today;
  });

  if (validBatches.length === 0) {
    return null;
  }

  return validBatches.sort((a, b) => {
    const dateA = new Date(a.bestBeforeDate);
    const dateB = new Date(b.bestBeforeDate);
    return dateA.getTime() - dateB.getTime();
  })[0].bestBeforeDate;
}

export const getDaysUntilExpiry = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Transform stripe address fields to match our shipping address entity
export const transformStripeAddressToAddress = (
  stripeAddress: StripeAddressElementChangeEvent['value'],
  prevAddress?: Address,
): Address => {
  return {
    shippingAddressId: prevAddress?.shippingAddressId,
    label: prevAddress?.label || 'New Address',
    phoneNumber: stripeAddress.phone || '',
    addressLine1: stripeAddress.address.line1 || '',
    addressLine2: stripeAddress.address.line2 || '',
    postalCode: stripeAddress.address.postal_code || '',
    isDefaultShippingAddress: false, // default false
    isDefaultBillingAddress: false, // default false
    buyerName: stripeAddress.name || '',
  };
};
