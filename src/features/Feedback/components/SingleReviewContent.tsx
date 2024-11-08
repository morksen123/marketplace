import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ReviewItem, ReviewSubmission } from '../types/review-types';
import { StarRating } from './StarRating';

interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: string;
  onReviewChange: (review: ReviewSubmission) => void;
  currentReview: ReviewSubmission | null;
}

// Constants
const CONDITION_TYPES = [
  { value: 'bruised', label: 'Bruised' },
  { value: 'nearExpiry', label: 'Near Expiry' },
  { value: 'oddShape', label: 'Odd Shape' },
  { value: 'overripe', label: 'Overripe' },
  { value: 'underripe', label: 'Underripe' },
  { value: 'blemished', label: 'Blemished' },
  { value: 'sizeVariation', label: 'Size Variation' },
] as const;

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
      qualityRating: 0,
      review: '',
      conditionAsDescribed: 'asDescribed',
      conditionTypes: [],
      usablePortion: '',
      usageIdeas: '',
      storageTips: '',
      valueForMoney: false,
      wouldBuyAgain: false,
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
            className="w-28 h-28 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-medium text-lg">{item.name}</h3>
            <p className="text-gray-600">Order #{orderId}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              Your review helps reduce food waste
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          {/* Overall Rating */}
          <div>
            <label className="block font-medium mb-2">
              Overall Value Rating
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Rate the overall value considering the discounted price
            </p>
            <StarRating
              rating={review.rating}
              onRatingChange={(rating) => handleReviewChange({ rating })}
            />
          </div>

          {/* Condition Assessment */}
          <div>
            <label className="block font-medium mb-2">
              How was the condition?
            </label>
            <select
              value={review.conditionAsDescribed}
              onChange={(e) =>
                handleReviewChange({
                  conditionAsDescribed: e.target
                    .value as ReviewSubmission['conditionAsDescribed'],
                })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="asDescribed">
                As Described - Exactly what I expected
              </option>
              <option value="betterThanDescribed">Better Than Expected</option>
              <option value="slightlyWorse">
                Fair - Slightly worse but still good value
              </option>
              <option value="significantlyWorse">
                Poor - Significantly worse than described
              </option>
              <option value="unusable">
                Unusable - Not suitable for intended use
              </option>
            </select>
          </div>

          {/* Imperfections Grid */}
          <div>
            <label className="block font-medium mb-2">
              What type of imperfections did you notice?
            </label>
            <p className="text-sm text-gray-500 mb-2">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {CONDITION_TYPES.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={review.conditionTypes.includes(value)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...review.conditionTypes, value]
                        : review.conditionTypes.filter((t) => t !== value);
                      handleReviewChange({ conditionTypes: newTypes });
                    }}
                    className="rounded mr-2"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Usable Portion */}
          <div>
            <label className="block font-medium mb-2">
              How much was usable?
            </label>
            <select
              value={review.usablePortion}
              onChange={(e) =>
                handleReviewChange({ usablePortion: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select usable portion</option>
              <option value="90-100">90-100% usable</option>
              <option value="70-90">70-90% usable</option>
              <option value="50-70">50-70% usable</option>
              <option value="under50">Less than 50% usable</option>
            </select>
          </div>

          {/* Quality Rating */}
          <div>
            <label className="block font-medium mb-2">
              Quality of the Usable Portion
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Rate the taste/quality of the usable part
            </p>
            <StarRating
              rating={review.qualityRating}
              onRatingChange={(qualityRating) =>
                handleReviewChange({ qualityRating })
              }
            />
          </div>

          {/* Usage Ideas */}
          <div>
            <label className="block font-medium mb-2">
              How did you use it?
            </label>
            <textarea
              value={review.usageIdeas}
              onChange={(e) =>
                handleReviewChange({ usageIdeas: e.target.value })
              }
              placeholder="Share how you used this item (e.g., recipes, preparation methods)"
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>

          {/* Storage Tips */}
          <div>
            <label className="block font-medium mb-2">Storage Tips</label>
            <textarea
              value={review.storageTips}
              onChange={(e) =>
                handleReviewChange({ storageTips: e.target.value })
              }
              placeholder="Share any tips for storing or extending shelf life"
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>

          {/* Final Questions */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={review.valueForMoney}
                onChange={(e) =>
                  handleReviewChange({ valueForMoney: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Good value for money</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={review.wouldBuyAgain}
                onChange={(e) =>
                  handleReviewChange({ wouldBuyAgain: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">I would buy this again</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
