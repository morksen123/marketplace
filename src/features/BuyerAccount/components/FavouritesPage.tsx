import ProductCard from '@/components/product/ProductCard';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';


const FavouritesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const [buyerId, setBuyerId] = useState<number | null>(0);
  const { favourites, toggleFavourite } = useFavourites();


  useEffect(() => {
    if(favourites !== undefined) {
      setIsLoading(false)
    }
  }, [favourites]);

  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
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
          {(favourites?.length) ?? 0 > 0 ? (
            favourites!.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                isFavourite={true}
                onToggleFavourite={() => toggleFavourite(product.productId)}
                onProductClick={handleProductClick}
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
