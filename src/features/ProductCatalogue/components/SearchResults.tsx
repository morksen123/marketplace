import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductFilter from './ProductFilter';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  // const [favourites, setFavourites] = useState({});
  const [filters, setFilters] = useState<{
    categories: string[];
    minPrice: number;
    maxPrice: number;
    conditions: string[]; 
    deliveryMethods: string[];
  }>({
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    conditions: [],
    deliveryMethods: [],
  });
  const [loading, setLoading] = useState(true);
  const { favourites, toggleFavourite, checkFavourite } = useFavourites();

  interface Product {
    productId: number
    listingTitle: string;
    productPictures: string[];
    foodCategory: string;
    foodCondition: string;
    deliveryMethod : string;
    price : number
  }
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:8080/api/products/search?keyword=${searchQuery}`
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setSearchResults(responseData);
        responseData.forEach((product : Product) => {
          checkFavourite(product.productId);
        });
      } catch (error) {
        console.log(searchQuery)
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = searchResults.filter((product) => {
        const matchesCategory =
          filters.categories.length === 0 ||
          filters.categories.includes(product.foodCategory);
        const matchesPrice =
          product.price >= filters.minPrice &&
          product.price <= filters.maxPrice;
        const matchesCondition =
          filters.conditions.length === 0 ||
          filters.conditions.includes(product.foodCondition); // Cast to string
        const matchesDeliveryMethod =
          filters.deliveryMethods.length === 0 ||
          filters.deliveryMethods.includes(product.deliveryMethod);

        return (
          matchesCategory &&
          matchesPrice &&
          matchesCondition &&
          matchesDeliveryMethod
        );
      });
      setFilteredResults(filtered);
    };

    applyFilters();
  }, [searchResults, filters]);

  const handleFilter = (newFilters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    conditions: string[]; 
    deliveryMethods: string[];
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleProductClick = (productId : number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{searchQuery}"
      </h1>

      <div className="flex mb-6">
        {/* Filter */}
        <div className="w-1/4 pr-8 pl-8">
          <ProductFilter onFilter={handleFilter} initialFilters={filters} />
        </div>

        {/* Product Cards */}
        <div className="w-3/4 pl-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                isFavourite={favourites?.some(
                  (fav) => fav.productId === product.productId,
                )}
                onProductClick={handleProductClick}
                onToggleFavourite={() =>
                  toggleFavourite(product.productId)
                }
              />
            ))}
          </div>

          {filteredResults.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No results found. Try adjusting your filters or search keyword.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
