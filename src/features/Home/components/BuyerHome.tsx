import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../../assets/buyer-homepage-banner.png';
import { foodCategoryMapping, foodConditionMapping } from '../constants';

export const BuyerHome = () => {
  const [products, setProducts] = useState([]);
  const [favourites, setFavourites] = useState({}); // To store favourite status per product
  const navigate = useNavigate();
  const [buyerId, setBuyerId] = useState<number | null>(0);

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
          data.forEach((product) => {
            checkFavourited(product.productId); // Check favourited status for each product
          });
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchBuyerId();
    fetchProducts();
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

  // Function to check if a product is favourited
  const checkFavourited = async (productId: number) => {
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
      if (response.ok) {
        const isFavourited = await response.json();
        setFavourites((prevFavourites) => ({
          ...prevFavourites,
          [productId]: isFavourited, // Update favourite status for the product
        }));
      } else {
        console.error('Failed to check if product is favourited');
      }
    } catch (error) {
      console.error('Error checking favourite status:', error);
    }
  };

  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  // Function to toggle favourite status for a product
  const handleToggleFavourite = async (productId: number) => {
    try {
      const isFavourited = favourites[productId];
      let response;
      if (isFavourited) {
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
        setFavourites((prevFavourites) => ({
          ...prevFavourites,
          [productId]: !isFavourited, // Toggle favourite status
        }));
        // alert(isFavourited ? 'Removed from favourites' : 'Added to favourites');
        console.log(
          isFavourited ? 'Removed from favourites' : 'Added to favourites',
        );
      } else {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        // to change to proper error message
        // alert(`Failed to update favourites: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error occurred while updating favourites:', error);
    }
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
              <div
                key={product.productId}
                className="bg-white shadow rounded-lg p-4 cursor-pointer relative"
                onClick={() => handleProductClick(product.productId)} // Navigate to product detail on click
              >
                {/* Displaying the first image from productPictures if available */}
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
                      e.stopPropagation(); // Prevent navigating to product page
                      handleToggleFavourite(product.productId); // Call function to toggle favourite
                    }}
                    className="ml-2 flex items-center"
                  >
                    <FavoriteOutlinedIcon
                      style={{
                        color: favourites[product.productId] ? 'red' : 'gray', // Set heart color based on favourite status
                        fontSize: '16px',
                      }}
                    />
                  </button>
                </div>

                <p className="text-gray-500">
                  {foodCategoryMapping[product.foodCategory] ||
                    product.foodCategory}
                </p>
                <p className="text-gray-500">
                  Condition:{' '}
                  {foodConditionMapping[product.foodCondition] ||
                    product.foodCondition}
                </p>
              </div>
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
