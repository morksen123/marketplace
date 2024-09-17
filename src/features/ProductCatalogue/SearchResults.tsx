import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from './ProductFilter';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

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

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`,
          );
        }

        const responseData = await response.json();
        console.log('Fetched data:', responseData);

        if (!Array.isArray(responseData)) {
          throw new Error(
            'Expected an array of products, but received a different data type',
          );
        }

        setSearchResults(responseData);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      console.log('Search query:', searchQuery);
      fetchSearchResults();
    }
  }, [searchQuery]);

  const handleSort = (sortType) => {
    setSortBy(sortType);
    // Implement sorting logic here
  };

  const handleFilter = (filterType) => {
    setFilterBy(filterType);
    // Implement filtering logic here
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
            <ProductFilter onFilter={handleFilter} />
          </div>

          {/* Product Cards */}
          <div className="w-3/4 pl-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {searchResults.length === 0 && (
              <p className="text-center text-gray-500 mt-8">
                No results found for "{searchQuery}". Try refining your search.
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
