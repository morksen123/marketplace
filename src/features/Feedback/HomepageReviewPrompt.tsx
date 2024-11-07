import { Package, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderLineItem } from '../Orders/types/orders';

interface HomepageReviewPromptProps {
  pendingReviews: OrderLineItem[];
}

export const HomepageReviewPrompt = ({
  pendingReviews,
}: HomepageReviewPromptProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || pendingReviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-blue-50">
      <div className="w-full px-10">
        <div className="relative flex items-center justify-between py-3">
          {/* Left Section: Icon and Text */}
          <div className="flex items-center space-x-3">
            <Package className="text-blue-600 h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                New deliveries arrived today!
              </p>
              <p className="text-sm text-gray-600">
                You have {pendingReviews.length} orders pending review
              </p>
            </div>
          </div>

          {/* Right Section: Images, Button, and Dismiss */}
          <div className="flex items-center space-x-4">
            {/* Profile Images */}
            <div className="hidden sm:flex -space-x-2">
              {pendingReviews.slice(0, 3).map((review) => (
                <img
                  key={review.orderId}
                  src="/api/placeholder/32/32"
                  alt={review.productName}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
              {pendingReviews.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-600 shadow-sm">
                  +{pendingReviews.length - 3}
                </div>
              )}
            </div>

            {/* Action Button */}
            <Link
              to="/reviews/pending"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-sm"
            >
              Write Reviews
            </Link>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsVisible(false)}
              className=" rounded-full hover:bg-blue-100 transition-colors duration-200"
              aria-label="Dismiss notification"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
