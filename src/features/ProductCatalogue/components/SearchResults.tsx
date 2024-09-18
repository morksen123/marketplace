import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authAtoms';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from './ProductFilter';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    conditions: [],
    deliveryMethods: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerId, setBuyerId] = useState<number | null>(0);
  // const [user] = useAtom(userAtom);
  // const buyerId = user?.id;

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:8080/api/products/search?keyword=${searchQuery}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setSearchResults(responseData);
        responseData.forEach((product) => {
          checkFavourited(product.productId);
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
    fetchBuyerId();
  }, [searchQuery]);

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


  const checkFavourited = async (productId) => {
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
          [productId]: isFavourited,
        }));
      } else {
        console.error('Failed to check if product is favourited');
      }
    } catch (error) {
      console.error('Error checking favourite status:', error);
    }
  };

  const handleToggleFavourite = async (productId) => {
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
          [productId]: !isFavourited,
        }));
        // alert(isFavourited ? 'Removed from favourites' : 'Added to favourites');
        console.log(isFavourited ? 'Removed from favourites' : 'Added to favourites');
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

  useEffect(() => {
    const applyFilters = () => {
      const filtered = searchResults.filter(product => {
        const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.foodCategory);
        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        const matchesCondition = filters.conditions.length === 0 || filters.conditions.includes(product.foodCondition);
        const matchesDeliveryMethod = filters.deliveryMethods.length === 0 || filters.deliveryMethods.includes(product.deliveryMethod);
        
        return matchesCategory && matchesPrice && matchesCondition && matchesDeliveryMethod;
      });
      setFilteredResults(filtered);
    };

    applyFilters();
  }, [searchResults, filters]);

  const handleFilter = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  const handleProductClick = (productId) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{searchQuery}"</h1>

      <div className="flex mb-6">
        {/* Filter */}
        <div className="w-1/4 pr-8 pl-8">
          <ProductFilter onFilter={handleFilter} initialFilters={filters}/>
        </div>

        {/* Product Cards */}
        <div className="w-3/4 pl-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((product) => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                isFavourite={favourites[product.productId]}
                onProductClick={() => handleProductClick(product.productId)}
                onToggleFavourite={() => handleToggleFavourite(product.productId)}
              />
            ))}
          </div>

          {filteredResults.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No results found. Try adjusting your filters.
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 mt-8">Error: {error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
