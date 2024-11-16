import { Promotion } from '@/features/Promotions/constants';

export const createProductListingDefaultValues = {
  listingTitle: '',
  foodCategory: '',
  foodCondition: '',
  minPurchaseQty: '',
  price: '',
  deliveryMethod: '',
  description: '',
  weight: '',
  units: '',
  pickUpLocation: '',
  batches: [{ bestBeforeDate: '', quantity: '', isActive: true }],
  productPictures: [],
  productTags: [],
  bulkPricings: [{ minQuantity: '', maxQuantity: '', price: '' }],
};

export const foodCategoryMapping: Record<string, string> = {
  FRUITS_AND_VEGETABLES: 'Fruits and Vegetables',
  FROZEN: 'Frozen',
  CANNED_GOODS: 'Canned Goods',
  DAIRY_AND_EGGS: 'Dairy and Eggs',
  DRY_GOODS_AND_STAPLES: 'Dry Goods and Staples',
};

export const foodConditionMapping: Record<string, string> = {
  BRUISED: 'Bruised',
  UGLY: 'Ugly',
  NEAR_EXPIRY: 'Near Expiry',
  DAMAGED_PACKAGING: 'Damaged Packaging',
};

export const deliveryMethodMapping: Record<string, string> = {
  SELF_PICK_UP: 'Self Pickup',
  DOORSTEP_DELIVERY: 'Doorstep Delivery',
};

export const unitMapping: Record<string, string> = {
  FRUITS_AND_VEGETABLES: 'kg',
  FROZEN: 'kg',
  CANNED_GOODS: 'can(s)',
  DAIRY_AND_EGGS: 'unit(s)',
  DRY_GOODS_AND_STAPLES: 'unit(s)',
};

export interface Batch {
  quantity: number;
  bestBeforeDate: string;
  batchId: number;
  isActive: boolean;
}

export interface BulkPricing {
  minQuantity: number;
  maxQuantity: number;
  price: number;
  id: number;
}

export interface Product {
  productId: number;
  listingTitle: string;
  price: number;
  productPictures: string[];
  foodCondition: string;
  foodCategory: string;
  description: string;
  weight: number;
  deliveryMethod: string;
  pickUpLocation?: string;
  minPurchaseQty: number;
  batches?: Batch[];
  bulkPricings?: BulkPricing[];
  promotions: Promotion[];
  distributorId: number;
  boostStatus: string;
}
