import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isValid: boolean;
  isBulkReview?: boolean;
  currentStep?: number;
  totalSteps?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ReviewFooter({
  onClose,
  onSubmit,
  isValid,
  isBulkReview = false,
  currentStep = 1,
  totalSteps = 1,
  onPrevious,
  onNext,
}: ReviewFooterProps) {
  const isLastStep = currentStep === totalSteps;

  if (!isBulkReview) {
    return (
      <footer className="p-4 bg-background border-t">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSubmit} disabled={!isValid}>
            Submit Review
          </Button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="p-4 bg-background border-t">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {isLastStep ? (
          <Button variant="secondary" onClick={onSubmit} disabled={!isValid}>
            Submit All Reviews
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={!isValid}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </footer>
  );
}
