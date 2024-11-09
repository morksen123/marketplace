import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateReviewDTO, ReviewItem } from '../../types/review-types';
import { ReviewPhotoUpload } from '../ReviewPhotoUpload';
import { StarRating } from '../StarRating';

interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: number;
  onReviewChange: (review: CreateReviewDTO) => void;
  currentReview: CreateReviewDTO | null;
}

const CONDITION_TYPES = [
  { value: 'BRUISED', label: 'Bruised' },
  { value: 'NEAR_EXPIRY', label: 'Near Expiry' },
  { value: 'ODD_SHAPE', label: 'Odd Shape' },
  { value: 'OVERRIPE', label: 'Overripe' },
  { value: 'UNDERRIPE', label: 'Underripe' },
  { value: 'BLEMISHED', label: 'Blemished' },
  { value: 'SIZE_VARIATION', label: 'Size Variation' },
] as const;

export function SingleReviewContent({
  item,
  orderId,
  onReviewChange,
  currentReview,
}: SingleReviewContentProps) {
  const [review, setReview] = useState<CreateReviewDTO>(
    currentReview || {
      orderLineItemId: item.orderLineItem,
      overallRating: 0,
      qualityRating: 0,
      review: '',
      conditionAsDescribed: 'AS_DESCRIBED',
      conditionTypes: [],
      usablePercentage: '',
      storageTips: '',
      wouldBuyAgain: true,
      photoUrls: [],
    },
  );
  const [productImage, setProductImage] = useState('');

  useEffect(() => {
    if (!currentReview) {
      setReview({
        orderLineItemId: item.orderLineItem,
        overallRating: 0,
        qualityRating: 0,
        review: '',
        conditionAsDescribed: 'AS_DESCRIBED',
        conditionTypes: [],
        usablePercentage: '',
        storageTips: '',
        wouldBuyAgain: true,
        photoUrls: [],
      });
    }
  }, [currentReview, item.orderLineItem]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/product/${item.productId}`);
        const data = await response.json();
        setProductImage(data.productPictures[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [item.productId]);

  const handleReviewChange = (updatedReview: Partial<CreateReviewDTO>) => {
    const newReview = { ...review, ...updatedReview };
    setReview(newReview);
    onReviewChange(newReview);
  };

  return (
    <Card className="w-full max-w-3xl rounded-none">
      <CardHeader className="flex flex-row items-center space-x-4 p-6 bg-secondary/5 mb-6">
        <img
          src={productImage || '/placeholder.svg?height=120&width=120'}
          alt={item.productName}
          className="w-28 h-28 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-medium">{item.productName}</h3>
          <p className="text-sm text-muted-foreground">Order #{orderId}</p>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            Your review helps reduce food waste
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="overall-rating" className="text-md">
            Overall Value Rating <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Rate the overall value considering the discounted price
          </p>
          <StarRating
            rating={review.overallRating}
            onRatingChange={(rating) =>
              handleReviewChange({ overallRating: rating })
            }
          />
        </div>

        <div>
          <Label className="block mb-2 text-md">
            How was the condition? <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={review.conditionAsDescribed}
              onChange={(e) =>
                handleReviewChange({
                  conditionAsDescribed: e.target
                    .value as CreateReviewDTO['conditionAsDescribed'],
                })
              }
              className="w-full p-2 pr-10 border rounded-lg appearance-none bg-white
        hover:border-black focus:outline-black text-sm"
            >
              <option value="" disabled>
                Select condition
              </option>
              <option value="AS_DESCRIBED">
                As Described - Exactly what I expected
              </option>
              <option value="BETTER_THAN_DESCRIBED">
                Better Than Expected
              </option>
              <option value="SLIGHTLY_WORSE">
                Fair - Slightly worse but still good value
              </option>
              <option value="SIGNIFICANTLY_WORSE">
                Poor - Significantly worse than described
              </option>
              <option value="UNUSABLE">
                Unusable - Not suitable for intended use
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">
            What type of imperfections did you notice?{' '}
            <span className="text-red-500">*</span>
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
                  className="rounded mr-2 accent-green-700"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="block  mb-2 text-md">
            How much of the product was usable?{' '}
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={review.usablePercentage}
              onChange={(e) =>
                handleReviewChange({ usablePercentage: e.target.value })
              }
              className="w-full p-2 pr-10 border rounded-lg appearance-none bg-white
        hover:border-black focus:outline-black text-sm"
            >
              <option value="" disabled>
                Select usable portion
              </option>
              <option value="90-100">90-100% usable</option>
              <option value="70-90">70-90% usable</option>
              <option value="50-70">50-70% usable</option>
              <option value="under50">Less than 50% usable</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality-rating" className="text-md">
            Quality of the Usable Portion{' '}
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Rate the taste/quality of the usable part
          </p>
          <StarRating
            rating={review.qualityRating}
            onRatingChange={(qualityRating) =>
              handleReviewChange({ qualityRating })
            }
          />
        </div>

        {/* buy again */}
        <div className="space-y-2">
          <Label htmlFor="buy-again" className="text-md">
            Would you buy this again? <span className="text-red-500">*</span>
          </Label>
          <div className="flex space-x-4">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() =>
                  handleReviewChange({ wouldBuyAgain: option === 'Yes' })
                }
                className={`text-sm px-4 py-2 rounded-lg border ${
                  review.wouldBuyAgain === (option === 'Yes')
                    ? 'bg-green-50 border-green-500 text-secondary'
                    : 'hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-md">Add Photos (Recommended)</Label>
          <ReviewPhotoUpload
            photoUrls={review.photoUrls || []}
            onPhotosChange={(urls) => handleReviewChange({ photoUrls: urls })}
            maxPhotos={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-md" htmlFor="review">
            Share your experience
          </Label>
          <Textarea
            id="review"
            value={review.review}
            onChange={(e) => handleReviewChange({ review: e.target.value })}
            placeholder="Share more about the item you received"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-md" htmlFor="storage-tips">
            Storage Tips
          </Label>
          <Textarea
            id="storage-tips"
            value={review.storageTips}
            onChange={(e) =>
              handleReviewChange({ storageTips: e.target.value })
            }
            placeholder="Share any tips for storing or extending shelf life"
          />
        </div>
      </CardContent>
    </Card>
  );
}
