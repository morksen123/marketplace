// hooks/useReviewModal.ts
import { Order } from '@/features/Orders/types/orders';
import { useState } from 'react';
import { CreateReviewDTO } from '../types/review-types';
import { useCreateReview } from './useReviews';

export const useReviewModal = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<CreateReviewDTO | null>(
    null,
  );
  const [bulkReviews, setBulkReviews] = useState<
    Record<number, CreateReviewDTO>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);

  const isBulkReview = Boolean(
    selectedOrder && selectedOrder?.orderLineItems.length > 1,
  );

  const createReviewMutation = useCreateReview();

  const handleNext = () => {
    if (
      selectedOrder &&
      activeIndex < selectedOrder.orderLineItems.length - 1
    ) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const openReviewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewModalOpen(false);
    setSelectedOrder(null);
    setCurrentReview(null);
    setBulkReviews({});
    setActiveIndex(0);
  };

  const handleReviewChange = (review: CreateReviewDTO) => {
    if (!isBulkReview) {
      setCurrentReview(review);
    } else {
      setBulkReviews((prev) => ({
        ...prev,
        [selectedOrder?.orderLineItems[activeIndex].orderLineItemId || 0]:
          review,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!isBulkReview) {
        await createReviewMutation.mutateAsync(currentReview!);
      } else {
        await Promise.all(
          Object.values(bulkReviews).map((review) =>
            createReviewMutation.mutateAsync(review),
          ),
        );
      }
      handleCloseReview();
    } catch (error) {
      console.error('Failed to submit review(s):', error);
    }
  };

  return {
    isOpen: isReviewModalOpen,
    isBulkReview,
    selectedOrder,
    currentReview,
    bulkReviews,
    activeIndex,
    openReviewModal,
    handleCloseReview,
    handleReviewChange,
    handleSubmit,
    handleNext,
    handlePrevious,
  };
};
