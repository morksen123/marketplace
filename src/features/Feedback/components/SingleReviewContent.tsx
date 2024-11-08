import { AlertCircle, Camera, X } from 'lucide-react';
import { useState } from 'react';
import { ReviewItem, ReviewSubmission } from '../types/review-types';
import { StarRating } from './StarRating';

interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: string;
  onReviewChange: (review: ReviewSubmission) => void;
  currentReview: ReviewSubmission | null;
}

export const SingleReviewContent = ({
  item,
  orderId,
  onReviewChange,
  currentReview,
}: SingleReviewContentProps) => {
  const [review, setReview] = useState<ReviewSubmission>(
    currentReview || {
      itemId: Number(item.id),
      orderId,
      rating: 0,
      review: '',
      qualityAsDescribed: false,
      wouldRecommend: false,
      usablePercentage: '',
      photos: [],
    },
  );

  const handleReviewChange = (updatedReview: Partial<ReviewSubmission>) => {
    const newReview = { ...review, ...updatedReview };
    setReview(newReview);
    onReviewChange(newReview);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start space-x-4">
          <img
            src={item.imageUrl || '/api/placeholder/120/120'}
            alt={item.name}
            className="w-30 h-30 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-medium text-lg">{item.name}</h3>
            <p className="text-gray-600">Order #{orderId}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              Your review helps others make informed decisions
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Overall Rating</label>
            <StarRating
              rating={review.rating}
              onRatingChange={(rating) => handleReviewChange({ rating })}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              How much of the product was usable?
            </label>
            <select
              value={review.usablePercentage}
              onChange={(e) =>
                handleReviewChange({ usablePercentage: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select percentage</option>
              <option value="100">100% - Fully usable</option>
              <option value="75">75% - Mostly usable</option>
              <option value="50">50% - Partially usable</option>
              <option value="25">25% - Limited use</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Your Review</label>
            <textarea
              value={review.review}
              onChange={(e) => handleReviewChange({ review: e.target.value })}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="How was the quality? Any tips for using this item?"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Add Photos (Optional)
            </label>
            <div className="space-y-3">
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Camera className="h-5 w-5" />
                <span>Upload Photos</span>
              </button>
              {review.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.photos.map((photo, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleReviewChange({
                            photos: review.photos.filter((_, i) => i !== index),
                          })
                        }
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={review.qualityAsDescribed}
                onChange={(e) =>
                  handleReviewChange({ qualityAsDescribed: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Quality was as described</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={review.wouldRecommend}
                onChange={(e) =>
                  handleReviewChange({ wouldRecommend: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">I would recommend this product</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
