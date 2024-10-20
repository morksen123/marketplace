import { Product } from '@/features/ProductCatalogue/constants';
import {
  foodCategoryMapping,
  foodConditionMapping,
} from '@/features/ProductListing/constants';
import { productViewEvent } from '@/lib/analytics';
import { getUserRoleFromCookie } from '@/lib/utils';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  isFavourite: boolean | undefined;
  onProductClick: (productId: number) => void;
  onToggleFavourite: (productId: number) => void;
  isPromotionalPage?: boolean;
}

const calculatePromotionalDiscount = (product: Product): number => {
  if (!product.promotions || product.promotions.length === 0) return 0;

  const activePromotions = product.promotions.filter(
    (promo) => promo.status === 'ACTIVE',
  );

  if (activePromotions.length === 0) return 0;

  // Apply the highest discount
  return Math.max(...activePromotions.map((promo) => promo.discountPercentage));
};

// Highlight: Added new function to calculate promotional price
const calculatePromotionalPrice = (product: Product): number => {
  const discountPercentage = calculatePromotionalDiscount(product);
  return product.price * (1 - discountPercentage / 100);
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavourite,
  onProductClick,
  onToggleFavourite,
  isPromotionalPage = false,
}) => {
  const isBoosted = product.boostStatus === 'ACTIVE';
  const discountPercentage = calculatePromotionalDiscount(product);
  const promotionalPrice = calculatePromotionalPrice(product);
  const userRole = getUserRoleFromCookie();

  const debouncedProductViewEvent = useCallback(
    debounce((productId: number) => {
      productViewEvent(productId);
    }, 500),
    [],
  );

  useEffect(() => {
    if (product && userRole === 'BUYER') {
      debouncedProductViewEvent(product.productId);
    }
  }, [product, debouncedProductViewEvent, userRole]);

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
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(product.productId);
        }}
        className="absolute top-2 right-2 flex items-center"
        aria-label="Toggle Favourite"
      >
        <FavoriteOutlinedIcon
          style={{
            color: isFavourite ? 'red' : 'gray',
            fontSize: '24px',
          }}
        />
      </button>

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
      </div>

      <p className="text-gray-500 ">
        {foodCategoryMapping[product.foodCategory]}
      </p>
      <p className="text-gray-500">
        Condition: {foodConditionMapping[product.foodCondition]}
      </p>

      {isPromotionalPage && (
        /* Highlight: Updated div to center content */
        <div className="mt-2 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <p className="text-gray-500 line-through mr-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-green-600 font-bold">
              ${promotionalPrice.toFixed(2)}
            </p>
          </div>
          {discountPercentage > 0 && (
            <p className="text-red-500 font-semibold mt-1">
              {discountPercentage}% OFF
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
