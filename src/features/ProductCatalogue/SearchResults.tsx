import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ProductCard from '@/components/product/ProductCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data - replace with actual API call in production
      const mockResults = [
        { id: 1, name: 'Organic Apples', price: 2.99, category: 'Fruits', expiryDate: '2023-09-30' },
        { id: 2, name: 'Canned Tomatoes', price: 1.50, category: 'Canned Goods', expiryDate: '2024-05-15' },
        { id: 3, name: 'Frozen Pizza', price: 4.99, category: 'Frozen', expiryDate: '2023-12-31' },
        { id: 4, name: 'Organic Bananas', price: 1.99, category: 'Fruits', expiryDate: '2023-09-25' },
        { id: 5, name: 'Canned Beans', price: 1.25, category: 'Canned Goods', expiryDate: '2024-06-30' },
      ];
      setSearchResults(mockResults);
      setLoading(false);
    };

    fetchSearchResults();
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{searchQuery}"</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <SearchIcon className="mr-2" />
          <input 
            type="text" 
            placeholder="Refine your search" 
            className="border rounded-md px-2 py-1"
            defaultValue={searchQuery}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <SortIcon className="mr-2" />
            <select 
              value={sortBy} 
              onChange={(e) => handleSort(e.target.value)}
              className="border rounded-md px-2 py-1"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="expiry-date">Expiry Date</option>
            </select>
          </div>
          <div className="flex items-center">
            <FilterListIcon className="mr-2" />
            <select 
              value={filterBy} 
              onChange={(e) => handleFilter(e.target.value)}
              className="border rounded-md px-2 py-1"
            >
              <option value="all">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="canned-goods">Canned Goods</option>
              <option value="frozen">Frozen</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No results found for "{searchQuery}". Try refining your search.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;