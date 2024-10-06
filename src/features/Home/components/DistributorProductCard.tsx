import React from 'react';
import { foodCategoryMapping, foodConditionMapping, boostStatusMapping } from '../constants';
import { Product } from '@/features/ProductCatalogue/constants';

interface DistributorProductCardProps {
  product: Product
  onProductClick: (productId: number) => void;
  onPauseBoost: (productId: number, product: Product) => void;
  onUpdateBoost: (productId: number) => void;
}

const DistributorProductCard: React.FC<DistributorProductCardProps> = ({
  product,
  onProductClick,
  onPauseBoost,
  onUpdateBoost
}) => {
  const handlePauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPauseBoost(product.productId, product);
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateBoost(product.productId);
  };

  return (
    <div
      className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onProductClick(product.productId)}
    >
      <img
        src={product.productPictures.length > 0 ? product.productPictures[0] : 'placeholder-image-url'}
        alt={product.listingTitle}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">{product.listingTitle}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {foodCategoryMapping[product.foodCategory] || product.foodCategory}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <i>{foodConditionMapping[product.foodCondition] || product.foodCondition}</i>
        </p>
        <div className="mb-3">
        <p className="text-sm font-semibold">
            Boost Status: <span className={`${product.boostStatus === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
              {boostStatusMapping[product.boostStatus] || product.boostStatus}
            </span>
          </p>
          <p className="text-sm">Boost End Date: {new Date(product.boostEndDate).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between space-x-2">
          <button
            className={`flex-1 ${
              product.boostStatus === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white font-bold py-2 px-4 rounded text-sm`}
            onClick={handlePauseClick}
          >
            {product.boostStatus === 'ACTIVE' ? 'Pause Boost' : 'Resume Boost'}
          </button>
          {/* <Button
            className="flex-1"
            variant="secondary"
            onClick={handleUpdateClick}
          >
            Update Boost
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default DistributorProductCard;