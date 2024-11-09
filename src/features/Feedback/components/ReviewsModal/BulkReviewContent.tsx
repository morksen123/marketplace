import { CreateReviewDTO, ReviewItem } from '../../types/review-types';
import { SingleReviewContent } from './SingleReviewContent';

interface BulkReviewContentProps {
  orders: ReviewItem[];
  currentStep: number;
  totalSteps: number;
  onReviewChange: (review: CreateReviewDTO) => void;
  currentReview: CreateReviewDTO | null;
}

export const BulkReviewContent = ({
  orders,
  currentStep,
  totalSteps,
  onReviewChange,
  currentReview,
}: BulkReviewContentProps) => {
  const currentItem = orders[currentStep - 1];

  return (
    <div className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="min-h-1 bg-gray-100">
        <div
          className="h-full bg-secondary transition-all duration-300"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />
      </div>

      {/* Review Content */}
      <div className="flex-1">
        <SingleReviewContent
          item={currentItem}
          orderId={currentItem.orderId.toString()}
          onReviewChange={onReviewChange}
          currentReview={currentReview}
        />
      </div>
    </div>
  );
};
