import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';
import { useCart } from '@/features/Cart/hooks/useCart';
import { ProductReviews } from '@/features/Feedback/components/ProductReviews';
import {
  Batch,
  BulkPricing,
  deliveryMethodMapping,
  foodCategoryMapping,
  foodConditionMapping,
  Product,
  unitMapping,
} from '@/features/ProductListing/constants';
import { triggerProductClickEvent } from '@/lib/analytics';
import { calculatePromotionalDiscount, formatDisplayDate } from '@/lib/utils';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import StarIcon from '@mui/icons-material/Star';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ViewProductListingBuyerProps {
  isBuyer: boolean;
}

export const ViewProductListingBuyer: React.FC<
  ViewProductListingBuyerProps
> = ({ isBuyer }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [distributor, setDistributor] = useState(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const { toggleFavourite, favourites } = useFavourites();
  const isFavourite = favourites?.some(
    (fav) => fav.productId === Number(productId),
  );
  const [promotionalPrice, setPromotionalPrice] = useState<number | null>(null);
  const [promotionalDiscount, setPromotionalDiscount] = useState<number>(0);
  const [discountedBulkPricing, setDiscountedBulkPricing] = useState<
    BulkPricing[]
  >([]);
  const [debouncedProductId, setDebouncedProductId] = useState<string | null>(
    null,
  );

  const debouncedSetProductId = useCallback(
    debounce((id: string) => {
      setDebouncedProductId(id);
    }, 500),
    [],
  );

  // Effect to update the debounced product ID
  useEffect(() => {
    if (productId) {
      debouncedSetProductId(productId);
    }
  }, [productId, debouncedSetProductId]);

  // Effect to trigger the click event when the debounced product ID changes
  useEffect(() => {
    if (debouncedProductId) {
      triggerProductClickEvent(debouncedProductId);
    }
  }, [debouncedProductId]);

  useEffect(() => {
    const fetchDistributor = async () => {
      if (distributorId) {
        try {
          const response = await fetch(
            `/api/distributor/admin/${distributorId}`,
          );
          if (!response.ok) {
            throw new Error('Failed to fetch distributor');
          }
          const data = await response.json();
          console.log(data);
          setDistributor(data);
        } catch (error) {
          console.error('Error fetching distributor:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDistributor();
  }, [distributorId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/product/${productId}`);
        const data = await response.json();
        setProduct(data);
        setBatches((data.batches || []).filter(batch => batch.isActive));
        setDistributorId(data.distributorId);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isBuyer]);

  useEffect(() => {
    if (product) {
      const discount = calculatePromotionalDiscount(product);
      setPromotionalDiscount(discount);
      if (discount > 0)
        setPromotionalPrice(applyDiscount(product.price, discount));

      // Update bulk pricing with discounts
      if (product.bulkPricings) {
        const updatedBulkPricing = product.bulkPricings.map((pricing) => ({
          ...pricing,
          discountedPrice: applyDiscount(pricing.price, discount),
        }));
        setDiscountedBulkPricing(updatedBulkPricing);
      }
    }
  }, [product]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  if (loading) {
    return <div className="wrapper">Loading...</div>;
  }

  if (!product) {
    return <div className="wrapper">No product found</div>;
  }

  const handleChatClick = async () => {
    if (distributorId) {
      try {
        const response = await fetch(
          `/api/chat/createOrGet?distributorId=${distributorId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          const chat = await response.json();
          navigate('/buyer/profile/chats', { state: { chatId: chat.chatId } });
        } else {
          console.error('Failed to create or get chat');
        }
      } catch (error) {
        console.error('Error occurred while checking or creating chat:', error);
      }
    }
  };

  // Function to apply discount to a price
  const applyDiscount = (price: number, discount: number): number => {
    return price * (1 - discount / 100);
  };

  return (
    <div className="wrapper text-left">
      {/* Carousel */}
      <Carousel className="w-full max-w-10xl mx-auto mb-6">
        <CarouselContent>
          {product.productPictures?.map((_, index) => {
            if (index % 3 === 0) {
              return (
                <CarouselItem key={index}>
                  <div className="flex space-x-2">
                    {product.productPictures
                      .slice(index, index + 3)
                      .map((pic, idx) => (
                        <div key={idx} className="w-1/3 p-1">
                          <Card className="h-full rounded-lg border-none">
                            <CardContent className="flex items-center justify-center h-full p-0">
                              <img
                                src={pic}
                                alt={`Product Image ${index + idx + 1}`}
                                className="object-cover w-full h-full rounded-lg"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                  </div>
                </CarouselItem>
              );
            }
            return null;
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex mb-6">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold">{product.listingTitle}</h1>
              {/* Pricing - implement promotion price here */}
              {promotionalPrice !== null ? (
                <>
                  <p className="text-2xl text-[#22C55E] font-semibold text-left mr-2">
                    ${promotionalPrice.toFixed(2)} per{' '}
                    {unitMapping[product.foodCategory] || 'unit'}
                  </p>
                  <p className="text-xl text-gray-500 line-through">
                    ${product.price.toFixed(2)} per{' '}
                    {unitMapping[product.foodCategory] || 'unit'}
                  </p>
                </>
              ) : (
                <p className="text-2xl text-[#22C55E] font-semibold text-left">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {isBuyer && (
              <button
                onClick={() => toggleFavourite(Number(productId))}
                className="flex items-center"
                aria-label="Toggle Favourite"
              >
                <FavoriteOutlinedIcon
                  style={{
                    color: isFavourite ? 'red' : 'gray',
                    fontSize: '28px',
                  }}
                />
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center mb-2">
              {/* Display distributor name */}
              <p className="mr-2 font-semibold">
                {distributor
                  ? distributor.distributorName
                  : 'Distributor not found'}
              </p>
              <div className="flex items-center bg-yellow-100 rounded-full px-2 py-1">
                <StarIcon style={{ color: 'gold', fontSize: '18px' }} />
                <span className="ml-1 text-sm font-medium">4.5</span>
              </div>
              <button
                className="ml-4 flex items-center button-green text-white rounded-full px-3 py-1 transition duration-300 ease-in-out"
                onClick={handleChatClick}
              >
                <ChatIcon style={{ fontSize: '18px' }} className="mr-1" />
                <span className="text-sm font-medium">Chat</span>
              </button>
            </div>
          </div>

          <hr className="border-gray-300 my-6" />
          <div className="text-left space-y-4">
            <h2 className="text-2xl font-semibold">Details</h2>

            <p>
              <strong>Food Condition: </strong>
              {foodConditionMapping[product.foodCondition] ||
                product.foodCondition}
            </p>
            <p>
              <strong>Food Category: </strong>
              {foodCategoryMapping[product.foodCategory] ||
                product.foodCategory}
            </p>
            <p>
              <strong>Description: </strong>
              {product.description}
            </p>
            <p>
              <strong>Delivery Method: </strong>
              {deliveryMethodMapping[product.deliveryMethod] ||
                product.deliveryMethod}
            </p>
            {product.pickUpLocation && (
              <p>
                <strong>Pick Up Location: </strong>
                {product.pickUpLocation}
              </p>
            )}
            {product.weight != null && product.weight > 0 && (
              <p>
                <strong>Weight: </strong>
                {product.weight} kg
              </p>
            )}
            <p>
              <strong>Minimum Purchase Quantity: </strong>
              {product.minPurchaseQty}{' '}
              {unitMapping[product.foodCategory] || 'unit'}
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Pricing Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Bulk Pricing</h2>
        {discountedBulkPricing && discountedBulkPricing.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Min Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Max Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Price per {unitMapping[product.foodCategory] || 'unit'}
                </th>
                {promotionalDiscount > 0 && (
                  <th className="border border-gray-300 px-4 py-2">
                    Promotional Price
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {discountedBulkPricing.map((pricing, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {pricing.minQuantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pricing.maxQuantity || 'No limit'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {promotionalDiscount > 0 ? (
                      <span className="text-gray-500 line-through">
                        ${pricing.price.toFixed(2)}
                      </span>
                    ) : (
                      `$${pricing.price.toFixed(2)}`
                    )}
                  </td>
                  {promotionalDiscount > 0 && (
                    <td className="border border-gray-300 px-4 py-2 text-[#22C55E] font-semibold">
                      ${pricing.discountedPrice.toFixed(2)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bulk pricing available for this product.</p>
        )}
      </div>

      {isBuyer && (
        <div className="mt-6 mb-6 flex justify-end space-x-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            className="border rounded px-2 py-1 w-16"
            min="1"
          />
          <button
            className="button-green text-white px-4 py-2 rounded-full flex items-center"
            onClick={() => handleAddToCart(product, quantity)}
          >
            <AddShoppingCartIcon className="mr-2" /> Add to Cart {product.foodCategory === 'FRUITS_AND_VEGETABLES' ? '(per kg)' : '(per item)'}
          </button>
        </div>
      )}

      {/* Batches Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Available Batches</h2>
        <div className="grid grid-cols-4 gap-4">
          {batches.map((batch, index) => (
            <Card key={index} className="flex items-center">
              <CardContent className="flex-1 p-4">
                <p className="font-semibold">Total Quantity</p>
                <p>
                  {batch.quantity} {unitMapping[product.foodCategory] || 'unit'}
                </p>
                <p className="font-semibold">Best Before Date</p>
                {batch.bestBeforeDate
                  ? formatDisplayDate(batch.bestBeforeDate)
                  : ''}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ProductReviews productId={Number(productId)} />
      </div>
    </div>
  );
};
