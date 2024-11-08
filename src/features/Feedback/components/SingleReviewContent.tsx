'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Camera } from 'lucide-react';
import { useState } from 'react';
import { ReviewItem, ReviewSubmission } from '../types/review-types';
import { StarRating } from './StarRating';

interface SingleReviewContentProps {
  item: ReviewItem;
  orderId: string;
  onReviewChange: (review: ReviewSubmission) => void;
  currentReview: ReviewSubmission | null;
}

const CONDITION_TYPES = [
  { value: 'bruised', label: 'Bruised' },
  { value: 'nearExpiry', label: 'Near Expiry' },
  { value: 'oddShape', label: 'Odd Shape' },
  { value: 'overripe', label: 'Overripe' },
  { value: 'underripe', label: 'Underripe' },
  { value: 'blemished', label: 'Blemished' },
  { value: 'sizeVariation', label: 'Size Variation' },
] as const;

export function SingleReviewContent({
  item,
  orderId,
  onReviewChange,
  currentReview,
}: SingleReviewContentProps) {
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
      wouldBuyAgain: true,
      photos: [],
    },
  );

  const handleReviewChange = (updatedReview: Partial<ReviewSubmission>) => {
    const newReview = { ...review, ...updatedReview };
    setReview(newReview);
    onReviewChange(newReview);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4 p-6">
        <img
          src={item.imageUrl || '/placeholder.svg?height=120&width=120'}
          alt={item.name}
          className="w-28 h-28 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">Order #{orderId}</p>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            Your review helps reduce food waste
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="overall-rating">
            Overall Value Rating <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Rate the overall value considering the discounted price
          </p>
          <StarRating
            rating={review.rating}
            onRatingChange={(rating) => handleReviewChange({ rating })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">
            How was the condition? <span className="text-destructive">*</span>
          </Label>
          <Select
            value={review.conditionAsDescribed}
            onValueChange={(value) =>
              handleReviewChange({
                conditionAsDescribed:
                  value as ReviewSubmission['conditionAsDescribed'],
              })
            }
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asDescribed">
                As Described - Exactly what I expected
              </SelectItem>
              <SelectItem value="betterThanDescribed">
                Better Than Expected
              </SelectItem>
              <SelectItem value="slightlyWorse">
                Fair - Slightly worse but still good value
              </SelectItem>
              <SelectItem value="significantlyWorse">
                Poor - Significantly worse than described
              </SelectItem>
              <SelectItem value="unusable">
                Unusable - Not suitable for intended use
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            What type of imperfections did you notice?{' '}
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {CONDITION_TYPES.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={review.conditionTypes.includes(value)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...review.conditionTypes, value]
                      : review.conditionTypes.filter((t) => t !== value);
                    handleReviewChange({ conditionTypes: newTypes });
                  }}
                />
                <Label htmlFor={value}>{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="usable-portion">
            How much of the product was usable?{' '}
            <span className="text-destructive">*</span>
          </Label>
          <Select
            value={review.usablePortion}
            onValueChange={(value) =>
              handleReviewChange({ usablePortion: value })
            }
          >
            <SelectTrigger id="usable-portion">
              <SelectValue placeholder="Select usable portion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90-100">90-100% usable</SelectItem>
              <SelectItem value="70-90">70-90% usable</SelectItem>
              <SelectItem value="50-70">50-70% usable</SelectItem>
              <SelectItem value="under50">Less than 50% usable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality-rating">
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

        <div className="space-y-2">
          <Label>
            Would you buy this again?{' '}
            <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={review.wouldBuyAgain ? 'yes' : 'no'}
            onValueChange={(value) =>
              handleReviewChange({ wouldBuyAgain: value === 'yes' })
            }
          >
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Add Photos (Recommended)</Label>
          <Button variant="outline" className="w-full">
            <Camera className="h-5 w-5 mr-2" />
            Upload Photos
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review">Share your experience</Label>
          <Textarea
            id="review"
            value={review.review}
            onChange={(e) => handleReviewChange({ review: e.target.value })}
            placeholder="Share more about the item you received"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage-tips">Storage Tips</Label>
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
