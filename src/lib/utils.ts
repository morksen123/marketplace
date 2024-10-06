import { RoleTypes } from '@/features/Authentication/types/auth';
import { Product } from '@/features/ProductListing/constants';
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
