import React, { useEffect, useState } from 'react';
import bannerImage from '../../../assets/buyer-homepage-banner.png';
import { useNavigate } from 'react-router-dom';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

export const BuyerHome = () => {
  const [products, setProducts] = useState([]);
  const [favourites, setFavourites] = useState({}); // To store favourite status per product
  const navigate = useNavigate();
  const buyerId = 1; // To change

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

    fetchProducts();
  }, []);

  // Function to check if a product is favourited
  const checkFavourited = async (productId: number) => {
    try {
      const response = await fetch(`/api/buyer/favourites/check?productId=${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
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
    navigate(`/view-product-listing/${productId}`);
  };

  // Function to toggle favourite status for a product
  const handleToggleFavourite = async (productId: number) => {
    try {
      const isFavourited = favourites[productId];
      let response;
      if (isFavourited) {
        response = await fetch(`/api/buyer/${buyerId}/favourites/${productId}/remove`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
      } else {
        response = await fetch(`/api/buyer/${buyerId}/favourites/${productId}/add`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
      }

      if (response.ok) {
        setFavourites((prevFavourites) => ({
          ...prevFavourites,
          [productId]: !isFavourited, // Toggle favourite status
        }));
        alert(isFavourited ? 'Removed from favourites' : 'Added to favourites');
      } else {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        alert(`Failed to update favourites: ${errorMessage}`);
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
        <h3 className="text-3xl text-left font-bold text-gray-800">Our Products</h3>
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
                  src={product.productPictures.length > 0 ? product.productPictures[0] : 'placeholder-image-url'}
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

                <p className="text-gray-500">{product.foodCategory}</p>
                <p className="text-gray-500">Condition: {product.foodCondition}</p>
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
