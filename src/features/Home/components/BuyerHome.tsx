import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../../assets/buyer-homepage-banner.png';
import ProductCard from '@/components/product/ProductCard';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';

export const BuyerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { favourites, toggleFavourite, checkFavourite } = useFavourites();

  interface Product {
    productId: number
    listingTitle: string;
    productPictures: string[];
    foodCategory: string;
    foodCondition: string;
  }

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/active', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data); // Store products from API response
          console.log(data)
          data.forEach((product : Product) => {
            checkFavourite(product.productId); // Check favourited status for each product
          });
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

 
  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img src={bannerImage} alt="GudFood Banner" className="w-full h-auto" />
      </section>

      <section className="wrapper mt-10">
        {/* To refactor ProductCard */}
        <h3 className="text-3xl text-left font-bold text-gray-800">
          Our Products
        </h3>
        {/* Products Listings */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                isFavourite={favourites?.some(
                  (fav) => fav.productId === product.productId,
                )}
                onToggleFavourite={() => toggleFavourite(product.productId)}
                onProductClick={handleProductClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-gray-500">No Products</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
