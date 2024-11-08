import { AlertCircle, Camera, Leaf, Star, X } from 'lucide-react';
import { useState } from 'react';

export const SingleItemReview = ({
  item,
  orderId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    usablePercentage: '',
    review: '',
    photos: [],
    wouldBuyAgain: null,
  });

  const calculateImpact = (percentage) => {
    const weightInKg = parseFloat(item.quantity);
    return {
      kgSaved: ((weightInKg * parseInt(percentage)) / 100).toFixed(1),
      co2Saved: (((weightInKg * parseInt(percentage)) / 100) * 2.5).toFixed(1),
    };
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
            <h2 className="text-xl font-semibold">Review Your Purchase</h2>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              Your review helps others reduce food waste
            </div>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ height: 'calc(100vh - 140px)' }}
        >
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex items-start space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-30 h-30 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-gray-600">Order #{orderId}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block font-medium mb-2">Overall Quality</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      formData.rating >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  />
                ))}
              </div>
            </div>

            {/* Usable Percentage */}
            <div>
              <label className="block font-medium mb-2">
                How much of the product was usable?
              </label>
              <select
                value={formData.usablePercentage}
                onChange={(e) =>
                  setFormData({ ...formData, usablePercentage: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select percentage</option>
                <option value="100">100% - Fully usable</option>
                <option value="75">75% - Mostly usable</option>
                <option value="50">50% - Partially usable</option>
                <option value="25">25% - Limited use</option>
              </select>

              {/* Impact Calculator */}
              {formData.usablePercentage && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 flex items-center">
                    <Leaf className="h-5 w-5 mr-2" />
                    Your Impact
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        Food Saved:
                      </span>
                      <span className="font-medium text-green-800">
                        {calculateImpact(formData.usablePercentage).kgSaved}kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        CO₂ Prevented:
                      </span>
                      <span className="font-medium text-green-800">
                        {calculateImpact(formData.usablePercentage).co2Saved}kg
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Written Review */}
            <div>
              <label className="block font-medium mb-2">
                Share your experience and tips
              </label>
              <textarea
                value={formData.review}
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
                placeholder="How was the quality? Any tips for using this item?"
                className="w-full p-3 border rounded-lg h-32"
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

            {/* Would Buy Again */}
            <div>
              <label className="block font-medium mb-2">
                Would you buy this again?
              </label>
              <div className="flex space-x-4">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        wouldBuyAgain: option === 'Yes',
                      })
                    }
                    className={`px-4 py-2 rounded-lg border ${
                      formData.wouldBuyAgain === (option === 'Yes')
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Thank you for helping reduce food waste!
            </span>
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmit(formData);
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
