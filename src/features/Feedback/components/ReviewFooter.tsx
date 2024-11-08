import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isValid: boolean;
  // Bulk review specific props
  isBulkReview?: boolean;
  currentStep?: number;
  totalSteps?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const ReviewFooter = ({
  onClose,
  onSubmit,
  isValid,
  isBulkReview = false,
  currentStep = 1,
  totalSteps = 1,
  onPrevious,
  onNext,
}: ReviewFooterProps) => {
  const isLastStep = currentStep === totalSteps;

  if (!isBulkReview) {
    return (
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 border-t">
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            currentStep === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-600">
          Review {currentStep} of {totalSteps}
        </div>

        {isLastStep ? (
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit All Reviews
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!isValid}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
