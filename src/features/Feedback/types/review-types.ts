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
  buyer: BuyerDTO;
  createdDateTime: string;
  isResolved: boolean;
  isPrompted: boolean;
  lastPromptedAt: string | null;
  promptCount: number;
  comments: ReviewCommentDTO[];
  reviewResponse?: ReviewResponseDTO;
  isAllowedToRespond: boolean;
}

export interface ReviewResponseDTO {
  id: number;
  response: string;
  distributor: DistributorDTO;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface ReviewCommentDTO {
  id: number;
  content: string;
  createdAt: string;
  // Add other comment fields as needed
}

export interface CreatePlatformRatingRequest {
  overallRating: number;
  impactAwareness: number;
  valueSatisfaction: number;
  suggestions?: string;
  wouldRecommend: boolean;
}

export interface RatingEligibility {
  canRate: boolean;
  nextEligibleDate?: string;
  message: string;
}

export interface ReviewPromptData {
  orderId: number;
  buyerId: number;
  distributorName: string;
  productNames: string[];
  promptNumber: number;
  isLastPrompt: boolean;
  promptTime: string;
}

export interface CreateReviewResponseRequest {
  reviewId: number;
  response: string;
}

export interface UpdateReviewResponseRequest {
  response: string;
}

export interface ReviewResponseDTO {
  id: number;
  response: string;
  distributor: DistributorDTO;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface BuyerDTO {
  buyerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributorDTO {
  distributorId: number;
  distributorName: string;
  email: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
  profilePicture?: string;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCardProps {
  review: ProductReviewDTO;
  isProductOwner: boolean;
}
