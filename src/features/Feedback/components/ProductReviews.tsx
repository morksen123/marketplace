import { LoadingSpinnerSvg } from '@/components/common/LoadingSpinner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useProductReviews } from '../hooks/useReviews';
import { ReviewCardProps } from '../types/review-types';
import { ReviewResponseForm } from './ReviewResponseForm';

interface ReviewImageProps {
  url: string;
  alt: string;
}

export const ProductReviews = ({ productId }: { productId: number }) => {
  const { data: reviews, isLoading } = useProductReviews(productId);

  if (isLoading) {
    return <LoadingSpinnerSvg />;
  }

  if (!reviews?.length) {
    return <div className="text-gray-500">No reviews yet</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isProductOwner={review.isAllowedToRespond}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewImage = ({ url, alt }: ReviewImageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={url}
          alt={alt}
          className="rounded-lg object-cover w-full h-24 cursor-pointer hover:opacity-90 transition-opacity"
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-2">
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, isProductOwner }: ReviewCardProps) => {
  const [isResponseFormOpen, setIsResponseFormOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-4 text-left">
      {/* Header - Always visible */}
      <div className="flex items-start gap-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {review.buyer.profilePic ? (
            <img
              src={review.buyer.profilePic}
              alt={`${review.buyer.firstName}'s profile`}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-base font-medium">
                {review.buyer.firstName.charAt(0)}
                {review.buyer.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Buyer Info and Primary Rating */}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">
                {review.buyer.firstName} {review.buyer.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(review.createdDateTime), 'MMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <StarRating rating={review.overallRating} />
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                review.wouldBuyAgain
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {review.wouldBuyAgain ? 'Would buy again' : 'Would not buy again'}
            </span>
          </div>
        </div>
      </div>

      {/* Condition Tags - Always visible */}
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
          {review.conditionAsDescribed}
        </span>
        {review.conditionTypes.map((type: string) => (
          <span
            key={type}
            className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs"
          >
            {type}
          </span>
        ))}
      </div>

      {/* Review Text - Always visible if exists */}
      {review.review && (
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
          {review.review}
        </p>
      )}

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3 border-t border-gray-200 pt-3">
          {/* Quality Rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Quality:</span>
            <StarRating rating={review.qualityRating} />
          </div>

          {/* Storage Tips & Usable Percentage */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {review.usablePercentage && (
              <div>
                <p className="text-xs font-medium">
                  Usable: {review.usablePercentage}%
                </p>
              </div>
            )}
            {review.storageTips && (
              <div>
                <p className="text-xs font-medium">
                  Storage: {review.storageTips}
                </p>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          {review.photoUrls && review.photoUrls.length > 0 && (
            <div className="grid grid-cols-6 gap-1">
              {review.photoUrls.map((url: string, index: number) => (
                <ReviewImage
                  key={index}
                  url={url}
                  alt={`Review photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Distributor Response - Always visible if exists */}
      {review.reviewResponse && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">Distributor Response</span>
            {isProductOwner && (
              <button
                onClick={() => setIsResponseFormOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {review.reviewResponse.response}
          </p>
        </div>
      )}

      {/* Response Button */}
      {!review.reviewResponse && isProductOwner && (
        <button
          onClick={() => setIsResponseFormOpen(true)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Respond to Review
        </button>
      )}

      <ReviewResponseForm
        reviewId={review.id}
        isOpen={isResponseFormOpen}
        onClose={() => setIsResponseFormOpen(false)}
        existingResponse={review.reviewResponse?.response}
        responseId={review.reviewResponse?.id}
      />
    </div>
  );
};
