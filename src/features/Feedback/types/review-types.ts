export interface ReviewItem {
  id: number;
  name: string;
  imageUrl?: string;
  orderId: string;
  quantity: string;
}

export interface ReviewSubmission {
  itemId: number;
  orderId: string;
  rating: number; // Overall value rating
  qualityRating: number; // Quality of usable portion
  review: string; // General comments
  conditionAsDescribed:
    | 'asDescribed'
    | 'betterThanDescribed'
    | 'slightlyWorse'
    | 'significantlyWorse'
    | 'unusable';
  conditionTypes: string[]; // Types of imperfections
  usablePortion: string; // How much was usable
  usageIdeas: string; // How it was used
  storageTips: string; // Storage advice
  valueForMoney: boolean;
  wouldBuyAgain: boolean;
  photos: string[];
}

export interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: string;
  onClose: () => void;
  onSubmit: (review: ReviewSubmission) => void;
}

export interface BulkReviewContentProps {
  orders: ReviewItem[];
  onSubmit?: (reviews: ReviewSubmission[]) => void;
}

export interface PendingOrder {
  id: string;
  deliveryDate: string;
  items: {
    id: number;
    name: string;
    quantity: string;
    price: string;
    image?: string;
  }[];
}
