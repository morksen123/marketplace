import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCart } from '@/features/Cart/hooks/useCart';
import {
  Batch,
  deliveryMethodMapping,
  foodCategoryMapping,
  foodConditionMapping,
  Product,
  unitMapping,
} from '@/features/ProductListing/constants';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ViewProductListingBuyerProps {
  isBuyer: boolean;
}

export const ViewProductListingBuyer: React.FC<
  ViewProductListingBuyerProps
> = ({ isBuyer }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [distributor, setDistributor] = useState(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [buyerId, setBuyerId] = useState<number | null>(0);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

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
        setBatches(data.batches || []);
        setDistributorId(data.distributorId);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBuyerId = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/buyer/profile`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          setBuyerId(data.buyerId);
        } else {
          console.error('Failed to fetch buyer ID');
        }
      } catch (error) {
        console.error('Error fetching buyer ID:', error);
      }
    };

    const checkFavourited = async () => {
      if (isBuyer) {
        try {
          const response = await fetch(
            `/api/buyer/favourites/check?productId=${productId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          );

          const result = await response.json();
          setIsFavourite(result);
        } catch (error) {
          console.error('Error checking if product is favourited:', error);
        }
      }
    };

    fetchBuyerId();
    fetchProduct();
    checkFavourited();
  }, [productId, isBuyer]);

  const handleToggleFavourite = async () => {
    if (!isBuyer) return;

    try {
      let response;
      if (isFavourite) {
        response = await fetch(
          `/api/buyer/${buyerId}/favourites/${productId}/remove`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
      } else {
        response = await fetch(
          `/api/buyer/${buyerId}/favourites/${productId}/add`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
      }

      if (response.ok) {
        setIsFavourite(!isFavourite);
      } else {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        alert(`Failed to update favourites: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error occurred while updating favourites:', error);
    }
  };

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

  return (
    <div className="wrapper">
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
              <h1 className="text-3xl font-bold text-left">
                {product.listingTitle}
              </h1>
              <p className="text-2xl text-[#017A37] font-semibold text-left">
                ${product.price.toFixed(2)} per{' '}
                {unitMapping[product.foodCategory] || 'unit'}
              </p>
            </div>

            {isBuyer && (
              <button
                onClick={handleToggleFavourite}
                className="flex items-center"
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
                className="ml-4 flex items-center bg-[#017A37] hover:bg-[#015A27] text-white rounded-full px-3 py-1 transition duration-300 ease-in-out"
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
        {product.bulkPricings && product.bulkPricings.length > 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {product.bulkPricings.map((pricing, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {pricing.minQuantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pricing.maxQuantity || 'No limit'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${pricing.price.toFixed(2)}
                  </td>
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
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
            onClick={() => handleAddToCart(product, quantity)}
          >
            <AddShoppingCartIcon className="mr-2" /> Add to Cart
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
    </div>
  );
};
