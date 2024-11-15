// components/ReviewModal.tsx
import { Order } from '@/features/Orders/types/orders';
import { CreateReviewDTO } from '../../types/review-types';
import { BulkReviewContent } from './BulkReviewContent';
import { ReviewFooter } from './ReviewFooter';
import { ReviewHeader } from './ReviewHeader';
import { ReviewsModalWrapper } from './ReviewsModalWrapper';
import { SingleReviewContent } from './SingleReviewContent';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBulkReview: boolean;
  selectedOrder: Order | null;
  currentReview: CreateReviewDTO | null;
  bulkReviews: Record<number, CreateReviewDTO>;
  activeIndex: number;
  onReviewChange: (review: CreateReviewDTO) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  isBulkReview,
  selectedOrder,
  currentReview,
  bulkReviews,
  activeIndex,
  onReviewChange,
  onSubmit,
  onPrevious,
  onNext,
}: ReviewModalProps) => {
  const selectedItem = selectedOrder?.orderLineItems[0];

  const currentItem = isBulkReview
    ? selectedOrder?.orderLineItems[activeIndex]
    : selectedItem;

  const isCurrentReviewValid = isBulkReview
    ? Boolean(
        bulkReviews[currentItem?.orderLineItem || 0]?.overallRating &&
          bulkReviews[currentItem?.orderLineItem || 0]?.review &&
          bulkReviews[currentItem?.orderLineItem || 0]?.usablePercentage &&
          bulkReviews[currentItem?.orderLineItem || 0]?.conditionAsDescribed &&
          bulkReviews[currentItem?.orderLineItem || 0]?.conditionTypes.length >
            0,
      )
    : Boolean(
        currentReview?.overallRating &&
          currentReview?.review &&
          currentReview?.usablePercentage &&
          currentReview?.conditionAsDescribed &&
          currentReview?.conditionTypes.length > 0,
      );

  if (!selectedOrder) return null;

  return (
    <ReviewsModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col text-left">
        <div className="flex-1 overflow-y-auto">
          <ReviewHeader
            isBulkReview={isBulkReview}
            currentStep={activeIndex + 1}
            totalSteps={selectedOrder.orderLineItems.length}
          />

          {isBulkReview ? (
            <BulkReviewContent
              orders={selectedOrder.orderLineItems}
              currentStep={activeIndex + 1}
              totalSteps={selectedOrder.orderLineItems.length}
              onReviewChange={onReviewChange}
              currentReview={
                currentItem ? bulkReviews[currentItem.orderLineItem] : null
              }
            />
          ) : (
            selectedItem && (
              <SingleReviewContent
                item={selectedItem}
                orderId={selectedOrder.orderId}
                onReviewChange={onReviewChange}
                currentReview={currentReview}
              />
            )
          )}
        </div>

        <ReviewFooter
          onClose={onClose}
          onSubmit={onSubmit}
          isValid={isCurrentReviewValid}
          isBulkReview={isBulkReview}
          currentStep={activeIndex + 1}
          totalSteps={selectedOrder.orderLineItems.length}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    </ReviewsModalWrapper>
  );
};
