import {
  Distributor,
  foodCategoryMapping,
  foodConditionMapping,
} from '@/features/Home/constants';
import { Product } from '@/features/ProductListing/constants';
import AddIcon from '@mui/icons-material/Add';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { DistributorOrdersPreview } from '@/features/Orders/components/DistributorOrdersPreview';
import CircularEconomyDonation from '@/features/Sustainability/CircularEconomy/components/CircularEconomyDonation';

export const DistributorHome = () => {
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product>([]);
  const [distributor, setDistributor] = useState<Distributor>([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'condition' | 'price' | 'expiry'>('expiry');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse, distributorResponse] =
          await Promise.all([
            fetch('/api/products/food-category'),
            fetch('http://localhost:8080/api/products/distributor/active', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }),
            fetch(`http://localhost:8080/api/distributor/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }),
          ]);

        const categoryData = await categoryResponse.json();
        const productsData = await productsResponse.json();
        const distributorData = await distributorResponse.json();

        console.log(categoryData);
        console.log(distributorData);

        setFoodCategories([...categoryData]); // Adding "All" to the categories
        setProducts(productsData);
        setDistributor(distributorData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/view-product-listing/${productId}`);
  };

  // Dummy data for metrics and orders
  const metrics = [
    { label: 'Food Saved', value: '500kg' },
    { label: 'Orders Fulfiled', value: '1000' },
    { label: 'Revenue Generated', value: '$15,000' },
    { label: 'New Customers', value: '50' },
  ];

  const orders = [
    { id: 1, product: 'Canned Beans', quantity: 100, status: 'Delivered' },
    { id: 2, product: 'Frozen Peas', quantity: 200, status: 'Pending' },
    { id: 3, product: 'Tomatoes', quantity: 150, status: 'Shipped' },
  ];

  // Function to get the days to earliest expiry and its urgency
  const getEarliestExpiryInfo = (batches: any[]) => {
    if (!batches || batches.length === 0) return { daysToExpiry: null};

    const now = new Date();
    const earliestBatch = batches.reduce((earliest, current) => {
      const earliestDate = new Date(earliest.bestBeforeDate);
      const currentDate = new Date(current.bestBeforeDate);
      return currentDate < earliestDate ? current : earliest;
    });

    const expiryDate = new Date(earliestBatch.bestBeforeDate);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
    return daysToExpiry;
  };

  const handleSort = (column: 'title' | 'category' | 'condition' | 'price' | 'expiry') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.foodCategory === selectedCategory;
      const matchesCondition = selectedCondition === 'All' || product.foodCondition === selectedCondition;
      
      const daysToExpiry = getEarliestExpiryInfo(product.batches);
      let matchesExpiry = true;
      if (selectedExpiry === 'Urgent') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry <= 3;
      } else if (selectedExpiry === 'Warning') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry > 3 && daysToExpiry <= 7;
      } else if (selectedExpiry === 'Near Expiry') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry > 7 && daysToExpiry <= 14;
      }

      return matchesSearch && matchesCategory && matchesCondition && matchesExpiry;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'title':
          return multiplier * a.listingTitle.localeCompare(b.listingTitle);
        case 'category':
          return multiplier * a.foodCategory.localeCompare(b.foodCategory);
        case 'condition':
          return multiplier * a.foodCondition.localeCompare(b.foodCondition);
        case 'price':
          return multiplier * (a.price - b.price);
        case 'expiry':
          const aExpiry = getEarliestExpiryInfo(a.batches);
          const bExpiry = getEarliestExpiryInfo(b.batches);
          if (typeof aExpiry === 'number' && typeof bExpiry === 'number') {
            return multiplier * (aExpiry - bExpiry);
          }
          return 0;
        default:
          return 0;
      }
    });

  // Add this helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="wrapper">
      {/* Store Title */}
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-3xl font-bold">Store</h1>

        {/* New Product Listing Button */}
        <div className="relative inline-block">
          <button
            className={`px-4 py-2 rounded-md text-white font-semibold flex items-center ${
              distributor.isApproved
                ? 'button button-green'
                : 'button button-green opacity-70 filter blur-[0.5px]'
            }`}
            onClick={() =>
              distributor.isApproved && navigate('/create-product-listing')
            }
            disabled={!distributor.isApproved}
            style={{
              cursor: distributor.isApproved ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.3s, background-color 0.3s, filter 0.3s',
            }}
          >
            <AddIcon className="mr-2" />
            New Product Listing
          </button>
          {!distributor.isApproved && (
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs font-medium rounded-md shadow-lg opacity-0 transition-opacity duration-300"
              style={{
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              Awaiting admin account approval
            </div>
          )}
        </div>
        <style jsx>{`
          .relative:hover > div {
            opacity: 1 !important;
          }
        `}</style>
      </div>

      <CircularEconomyDonation />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold">{metric.value}</h3>
            <p className="text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left">Orders</h2>
        <DistributorOrdersPreview />
      </div>
      {/* Product Listings Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left">Product Listings</h2>
        <div className="p-4 bg-white rounded-lg shadow">
          {/* Search and Filter Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <TextField
              label="Search by title"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <FormControl variant="outlined" size="small" className="w-48 text-left">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="All">All</MenuItem>
                {foodCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {foodCategoryMapping[category] || category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" className="w-40 text-left">
              <InputLabel>Expiry</InputLabel>
              <Select
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
                label="Expiry"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Near Expiry">Near Expiry</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" className="w-40 text-left">
              <InputLabel>Condition</InputLabel>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                label="Condition"
              >
                <MenuItem value="All">All</MenuItem>
                {Object.entries(foodConditionMapping).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'title'}
                    direction={sortBy === 'title' ? sortOrder : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'category'}
                    direction={sortBy === 'category' ? sortOrder : 'asc'}
                    onClick={() => handleSort('category')}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'condition'}
                    direction={sortBy === 'condition' ? sortOrder : 'asc'}
                    onClick={() => handleSort('condition')}
                  >
                    Condition
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'price'}
                    direction={sortBy === 'price' ? sortOrder : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'expiry'}
                    direction={sortBy === 'expiry' ? sortOrder : 'asc'}
                    onClick={() => handleSort('expiry')}
                  >
                    Earliest Batch Expiry
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product: any) => {
                  let alertClass = ''
                  let alertBadge = null;
                  const daysToExpiry = getEarliestExpiryInfo(product.batches);

                  if (typeof daysToExpiry === 'number') {
                    if (daysToExpiry <= 0) {
                      alertClass = 'text-gray-500';
                      alertBadge = <Badge className="bg-gray-500 text-white">Not Available for Sale</Badge>;
                    } else if (daysToExpiry <= 3) {
                      alertClass = 'text-red-600 font-bold';
                      alertBadge = <Badge className="bg-red-500 text-white">Urgent</Badge>;
                    } else if (daysToExpiry <= 7) {
                      alertClass = 'text-orange-600 font-bold';
                      alertBadge = <Badge className="bg-orange-500 text-white">Warning</Badge>;
                    } else if (daysToExpiry <= 14) {
                      alertClass = 'text-yellow-600 font-bold';
                      alertBadge = <Badge className="bg-yellow-500 text-white">Near Expiry</Badge>;
                    }
                  }
                  
                  return (
                    <TableRow 
                      key={product.productId} 
                      onClick={() => handleProductClick(product.productId)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell>
                        <img
                          src={
                            product.productPictures.length > 0
                              ? product.productPictures[0]
                              : 'placeholder-image-url'
                          }
                          alt={product.listingTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={product.listingTitle} arrow>
                          <span>{truncateText(product.listingTitle, 100)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={foodCategoryMapping[product.foodCategory] || product.foodCategory} arrow>
                          <span>{truncateText(foodCategoryMapping[product.foodCategory] || product.foodCategory, 30)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={foodConditionMapping[product.foodCondition] || product.foodCondition} arrow>
                          {truncateText(foodConditionMapping[product.foodCondition] || product.foodCondition, 30)}
                        </Tooltip>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {typeof daysToExpiry === 'number' ? (
                          <div className={`flex flex-col items-start ${alertClass}`}>
                            <span>{daysToExpiry <= 0 ? 'Expired' : `${daysToExpiry} days`}</span>
                            {alertBadge}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <p className="text-gray-500">No Products</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};