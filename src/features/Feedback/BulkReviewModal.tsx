import {
  AlertCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useState } from 'react';

export const BulkReviewModal = ({ orders, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reviews, setReviews] = useState({});
  const allItems = orders.flatMap((order) => order.items);

  const handleRatingChange = (itemId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating,
      },
    }));
  };

  const handleReviewChange = (itemId, text) => {
    setReviews((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        review: text,
      },
    }));
  };

  const handleSubmitAll = () => {
    // Submit all reviews
    console.log('Submitting reviews:', reviews);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white 
        shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Review Your Items</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep + 1} of {allItems.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / allItems.length) * 100}%` }}
          />
        </div>

        {/* Current Item Review */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex items-start space-x-4">
              <img
                src="/api/placeholder/120/120"
                alt={allItems[currentStep].name}
                className="w-30 h-30 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-lg">
                  {allItems[currentStep].name}
                </h3>
                <p className="text-gray-600">
                  Order #{allItems[currentStep].orderId}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Your feedback helps reduce food waste
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-medium mb-2">
                How was the condition?
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      (reviews[allItems[currentStep].id]?.rating || 0) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() =>
                      handleRatingChange(allItems[currentStep].id, star)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block font-medium mb-2">
                Share your experience
              </label>
              <textarea
                className="w-full p-3 border rounded-lg h-32"
                placeholder="How was the quality? Any tips for using this item?"
                value={reviews[allItems[currentStep].id]?.review || ''}
                onChange={(e) =>
                  handleReviewChange(allItems[currentStep].id, e.target.value)
                }
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block font-medium mb-2">
                Add Photos (Optional)
              </label>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                <Camera className="h-5 w-5" />
                <span>Upload Photos</span>
              </button>
            </div>

            {/* Food Waste Impact */}
            <div className="bg-green-50 p-4 rounded-lg">
              <label className="block font-medium mb-2">
                Food Waste Impact
              </label>
              <div className="flex items-center space-x-4">
                <select className="p-2 border rounded-md">
                  <option value="">How much was usable?</option>
                  <option value="100">100% Usable</option>
                  <option value="75">75% Usable</option>
                  <option value="50">50% Usable</option>
                  <option value="25">25% Usable</option>
                </select>
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < allItems.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAll}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit All Reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
