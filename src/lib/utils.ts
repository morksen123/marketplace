import { RoleTypes } from '@/features/Authentication/types/auth';
import { Batch, Product } from '@/features/ProductListing/constants';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Cookies from 'universal-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
  return diffDays <= 3 && diffDays >= 0;
};

export function getEarliestBatchDate(batches?: Batch[]): string | null {
  if (!batches || batches.length === 0) {
    return null;
  }

  return batches.reduce((earliestDate: string | null, currentBatch) => {
    if (!currentBatch.isActive || currentBatch.quantity <= 0) {
      return earliestDate;
    }

    if (earliestDate === null) {
      return currentBatch.bestBeforeDate;
    }

    const currentDate = new Date(currentBatch.bestBeforeDate);
    const earliestDateObj = new Date(earliestDate);

    return currentDate < earliestDateObj
      ? currentBatch.bestBeforeDate
      : earliestDate;
  }, null);
}

export const getDaysUntilExpiry = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
