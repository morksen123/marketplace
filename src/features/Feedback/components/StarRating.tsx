import { Button } from '@/components/ui/button';

export const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Button
        key={star}
        variant="ghost"
        size="sm"
        onClick={() => onRatingChange(star)}
        className={`
          ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          hover:text-yellow-500 transition-colors
        `}
      >
        ★
      </Button>
    ))}
  </div>
);
