interface ReviewHeaderInterface {
  currentStep: number;
  totalSteps: number;
  isBulkReview: boolean;
}
export const ReviewHeader = ({
  currentStep,
  totalSteps,
  isBulkReview,
}: ReviewHeaderInterface) => {
  return (
    <div className="p-6 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Review Your Purchase</h2>
          {isBulkReview && (
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
