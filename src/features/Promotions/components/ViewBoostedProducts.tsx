import React, { useState } from 'react';
import { useProductBoosts } from '../hooks/useProductBoost';
import DistributorProductCard from '@/features/Home/components/DistributorProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/features/ProductListing/constants';

const ViewBoostedProducts: React.FC = () => {
  const { boostedProducts, isLoading, pauseBoost, reactivateBoost, updateBoost } =
    useProductBoosts();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newEndDate, setNewEndDate] = useState<string>('');
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    // Handle product click (e.g., navigate to product detail page)
    navigate(`/view-product-listing/${productId}`);
    console.log(`Clicked product ${productId}`);
  };

  const handlePauseResumeBoost = (productId: number, product: Product) => {
    product.boostStatus === 'ACTIVE' ? pauseBoost(productId) : reactivateBoost(productId);
  };

  const handleUpdateBoost = (productId: number) => {
    setSelectedProduct(productId);
    setNewEndDate(getTodayDate()); 
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateConfirm = () => {
    if (selectedProduct && newEndDate) {
      // Create a new Date object from the selected date
      const endDate = new Date(newEndDate);

      // Set the time to 23:59:59
      endDate.setHours(23, 59, 59, 999);

      // Convert to ISO string
      const endDateISOString = endDate.toISOString();

      updateBoost({
        productId: selectedProduct,
        boostData: { endDate: endDateISOString },
      });
      setIsUpdateDialogOpen(false);
      setSelectedProduct(null);
      setNewEndDate('');
    }
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isLoading) {
    return <div>Loading boosted products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Boosted Products</h1>
      {boostedProducts && boostedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boostedProducts.map((product) => (
            <DistributorProductCard
              key={product.productId}
              product={product}
              onProductClick={handleProductClick}
              onPauseBoost={handlePauseResumeBoost}
              onUpdateBoost={handleUpdateBoost}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No boosted products found.
        </div>
      )}

      {isUpdateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Update Boost End Date</h2>
            <Input
              id="end-date"
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
              min={getTodayDate()}
            />
            <div className="flex justify-end space-x-2">
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateConfirm}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBoostedProducts;
