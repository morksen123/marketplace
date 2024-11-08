export interface ReviewSubmission {
  itemId: number;
  orderId: string;
  rating: number;
  review: string;
  qualityAsDescribed: boolean;
  wouldRecommend: boolean;
  usablePercentage: string;
  photos: string[];
}

export interface ReviewItem {
  id: number;
  name: string;
  imageUrl: string;
  orderId: string;
  quantity: string;
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
