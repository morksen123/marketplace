import { OrderLineItem } from '@/features/Orders/types/orders';

export type ReviewItem = OrderLineItem;

export interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: string;
  onClose: () => void;
  onSubmit: (review: CreateReviewDTO) => void;
}

export interface BulkReviewContentProps {
  orders: ReviewItem[];
  onSubmit?: (reviews: CreateReviewDTO[]) => void;
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

export interface CreateReviewDTO {
  orderLineItemId: number;
  overallRating: number;
  qualityRating: number;
  conditionAsDescribed:
    | 'AS_DESCRIBED'
    | 'BETTER_THAN_DESCRIBED'
    | 'SLIGHTLY_WORSE'
    | 'SIGNIFICANTLY_WORSE'
    | 'UNUSABLE';
  conditionTypes: string[];
  usablePercentage: string;
  storageTips?: string;
  wouldBuyAgain: boolean;
  review?: string;
  photoUrls?: string[];
}

export interface ProductReviewDTO extends CreateReviewDTO {
  id: number;
  buyerId: number;
  createdDateTime: string;
  isResolved: boolean;
  isPrompted: boolean;
  lastPromptedAt: string | null;
  promptCount: number;
  comments: ReviewCommentDTO[];
}

export interface ReviewCommentDTO {
  id: number;
  content: string;
  createdAt: string;
  // Add other comment fields as needed
}
