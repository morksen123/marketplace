import ProductCard from '@/components/product/ProductCard';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  listingTitle: string;
  productPictures: string[];
  foodCategory: string;
  foodCondition: string;
}

const FavouritesPage: React.FC = () => {
  const [favouriteProducts, setFavouriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [buyerId, setBuyerId] = useState<number | null>(0);

  useEffect(() => {
    fetchBuyerId();
    fetchFavouriteProducts();
  }, []);

  const fetchBuyerId = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/buyer/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
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

  const fetchFavouriteProducts = async () => {
    // if (!buyerId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/buyer/favourites`,
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
        setFavouriteProducts(data);
      } else {
        console.error('Failed to fetch favourite products');
      }
    } catch (error) {
      console.error('Error fetching favourite products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  const handleToggleFavourite = async (productId: number) => {
    try {
      const response = await fetch(
        `/api/buyer/${buyerId}/favourites/${productId}/remove`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response.ok) {
        setFavouriteProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== productId),
        );
        // alert('Removed from favourites');
        console.log('Removed from favourites');
      } else {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        // to change to proper error message
        // alert(`Failed to remove from favourites: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error occurred while updating favourites:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      {isLoading ? (
        <div className="text-center">
          <p>Loading favourites...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favouriteProducts.length > 0 ? (
            favouriteProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                isFavourite={true}
                onProductClick={handleProductClick}
                onToggleFavourite={handleToggleFavourite}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-gray-500">No favourite products</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
