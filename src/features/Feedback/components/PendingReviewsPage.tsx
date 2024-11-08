import { Button } from '@/components/ui/button';
import { pendingReviewOrders } from '@/mock-data';
import { ChevronRight, Clock, Package } from 'lucide-react';
import { useState } from 'react';
import {
  PendingOrder,
  ReviewItem,
  ReviewSubmission,
} from '../types/review-types';
import { BulkReviewContent } from './BulkReviewContent';
import { ReviewFooter } from './ReviewFooter';
import { ReviewHeader } from './ReviewHeader';
import { ReviewsModalWrapper } from './ReviewsModalWrapper';
import { SingleReviewContent } from './SingleReviewContent';

// Helper Components
const OrderHeader = ({
  order,
  onReviewAll,
}: {
  order: (typeof pendingReviewOrders)[0];
  onReviewAll: () => void;
}) => (
  <div className="p-4 border-b">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Package className="text-gray-400 h-5 w-5" />
        <div>
          <span className="font-medium">Order #{order.id}</span>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Delivered {order.deliveryDate}</span>
          </div>
        </div>
      </div>
      <Button onClick={onReviewAll} variant="secondary">
        Review All Items
      </Button>
    </div>
  </div>
);

const OrderItem = ({
  item,
  onReviewClick,
}: {
  item: (typeof pendingReviewOrders)[0]['items'][0];
  onReviewClick: () => void;
}) => (
  <div className="p-4">
    <div className="flex items-center">
      <img
        src={item.image || '/api/placeholder/80/80'}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quantity: {item.quantity}
            </p>
          </div>
          <button
            onClick={onReviewClick}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>Write Review</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const OrderFooter = ({ itemCount }: { itemCount: number }) => (
  <div className="p-4 bg-blue-50 rounded-b-lg">
    <div className="flex items-center justify-between text-sm">
      <span className="text-secondary">
        Your reviews help save {itemCount} items from waste
      </span>
      <span className="text-gray-600">{itemCount} items pending review</span>
    </div>
  </div>
);

const OrderCard = ({
  order,
  onReviewClick,
  onReviewAll,
}: {
  order: (typeof pendingReviewOrders)[0];
  onReviewClick: (item: ReviewItem, orderId: string) => void;
  onReviewAll: () => void;
}) => (
  <div className="bg-white rounded-lg shadow">
    <OrderHeader order={order} onReviewAll={onReviewAll} />
    <div className="divide-y">
      {order.items.map((item) => (
        <OrderItem
          key={item.id}
          item={item}
          onReviewClick={() => onReviewClick(formatReviewItem(item), order.id)}
        />
      ))}
    </div>
    <OrderFooter itemCount={order.items.length} />
  </div>
);

// Helper function
const formatReviewItem = (
  item: (typeof pendingReviewOrders)[0]['items'][0],
): ReviewItem => ({
  id: Number(item.id),
  name: item.name,
  imageUrl: item.image || '/api/placeholder/80/80',
  orderId: item.id.toString(),
  quantity: item.quantity,
});

export const PendingReviewsPage = () => {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [currentReview, setCurrentReview] = useState<ReviewSubmission | null>(
    null,
  );
  const [bulkReviews, setBulkReviews] = useState<
    Record<number, ReviewSubmission>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);

  const handleReviewClick = (item: ReviewItem, orderId: string) => {
    setSelectedItem(item);
    setSelectedOrderId(orderId);
    setIsReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewModalOpen(false);
    setSelectedItem(null);
    setSelectedOrderId(null);
  };

  // Separate handlers for single and bulk reviews for better type safety
  const handleSingleReviewSubmit = async (review: ReviewSubmission) => {
    try {
      console.log('Submitting single review:', review);
      // await reviewService.submitSingleReview(review);
      handleCloseReview();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleBulkReviewSubmit = async (reviews: ReviewSubmission[]) => {
    try {
      console.log('Submitting bulk reviews:', reviews);
      // await reviewService.submitBulkReviews(reviews);
      handleCloseReview();
    } catch (error) {
      console.error('Failed to submit reviews:', error);
    }
  };

  const formatReviewItem = (item: PendingOrder['items'][0]): ReviewItem => ({
    id: item.id,
    name: item.name,
    imageUrl: item.image || '/api/placeholder/80/80',
    orderId: selectedOrderId as string,
    quantity: item.quantity,
  });

  const selectedOrder = pendingReviewOrders.find(
    (order) => order.id === selectedOrderId,
  );

  const handleNext = () => {
    if (selectedOrder && activeIndex < selectedOrder.items.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReviewChange = (review: ReviewSubmission) => {
    if (selectedItem) {
      setCurrentReview(review);
    } else {
      setBulkReviews((prev) => ({
        ...prev,
        [Number(selectedOrder?.items[activeIndex].id)]: review,
      }));
    }
  };

  const isBulkReview = selectedOrderId && !selectedItem;
  const currentItem = isBulkReview
    ? selectedOrder?.items[activeIndex]
    : selectedItem;

  const isCurrentReviewValid = isBulkReview
    ? Boolean(
        bulkReviews[Number(currentItem?.id)]?.rating &&
          bulkReviews[Number(currentItem?.id)]?.review,
      )
    : Boolean(currentReview?.rating && currentReview?.review);

  // const areAllReviewsComplete = selectedOrder?.items.every((item) => {
  //   const review = bulkReviews[Number(item.id)];
  //   return review?.rating && review?.review && review?.usablePercentage;
  // });

  const handleSubmit = () => {
    if (isBulkReview) {
      handleBulkReviewSubmit(Object.values(bulkReviews));
    } else if (currentReview) {
      handleSingleReviewSubmit(currentReview);
    }
  };

  return (
    <div className="py-1 text-left">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Pending Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            Your reviews help reduce food waste by helping others make informed
            decisions
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {pendingReviewOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReviewClick={handleReviewClick}
              onReviewAll={() => {
                setSelectedOrderId(order.id);
                setIsReviewModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewsModalWrapper
        isOpen={isReviewModalOpen}
        onClose={handleCloseReview}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ReviewHeader
              isBulkReview={!!isBulkReview}
              currentStep={activeIndex + 1}
              totalSteps={selectedOrder?.items.length || 1}
            />
            {isBulkReview && selectedOrder ? (
              <BulkReviewContent
                orders={selectedOrder.items.map(formatReviewItem)}
                currentStep={activeIndex + 1}
                totalSteps={selectedOrder.items.length}
                onReviewChange={handleReviewChange}
                currentReview={bulkReviews[Number(currentItem?.id)]}
              />
            ) : (
              selectedItem &&
              selectedOrderId && (
                <SingleReviewContent
                  item={selectedItem}
                  orderId={selectedOrderId}
                  onReviewChange={handleReviewChange}
                  currentReview={currentReview}
                />
              )
            )}
          </div>

          <ReviewFooter
            onClose={handleCloseReview}
            onSubmit={handleSubmit}
            isValid={
              isBulkReview ? isCurrentReviewValid : Boolean(currentReview)
            }
            isBulkReview={!!isBulkReview}
            currentStep={activeIndex + 1}
            totalSteps={selectedOrder?.items.length || 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </ReviewsModalWrapper>
    </div>
  );
};
