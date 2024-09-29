import {
  foodCategoryMapping,
  foodConditionMapping,
} from '@/features/ProductListing/constants';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import React from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Product } from '@/features/ProductCatalogue/constants';

interface ProductCardProps {
  product: Product;
  isFavourite: boolean | undefined;
  onProductClick: (productId: number) => void;
  onToggleFavourite: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavourite,
  onProductClick,
  onToggleFavourite,
}) => {
  const isBoosted = product.boostStatus === 'ACTIVE';

  return (
    <div
      className="bg-white shadow rounded-lg p-4 cursor-pointer relative"
      onClick={() => onProductClick(product.productId)}
    >
      {isBoosted && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
          <RocketLaunchIcon style={{ fontSize: '14px', marginRight: '2px' }} />
          Featured
        </div>
      )}
      <img
        src={
          product.productPictures.length > 0
            ? product.productPictures[0]
            : 'placeholder-image-url'
        }
        alt={product.listingTitle}
        className="w-full h-40 object-cover rounded"
      />

      <div className="flex justify-center items-center mt-4">
        <h3 className="text-lg font-bold">{product.listingTitle}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(product.productId);
          }}
          className="ml-2 flex items-center"
          aria-label="Toggle Favourite"
        >
          <FavoriteOutlinedIcon
            style={{
              color: isFavourite ? 'red' : 'gray',
              fontSize: '16px',
            }}
          />
        </button>
      </div>

      <p className="text-gray-500 ">
        {foodCategoryMapping[product.foodCategory]}
      </p>
      <p className="text-gray-500">
        Condition: {foodConditionMapping[product.foodCondition]}
      </p>
    </div>
  );
};

export default ProductCard;
