import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export const DistributorHome = () => {

  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch('/api/products/food-category'),
          fetch('http://localhost:8080/api/products/distributor/active', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmdAZ21haWwuY29tIiwiaWF0IjoxNzI2MjA3NDIzLCJleHAiOjE3MjY4MTIyMjN9.SScCI90ac49GsW1hVd-7Q8tXNo3UAWjkL3G5Ej2aywo',
              'Content-Type': 'application/json',
            }
          })
        ]);

        const categoryData = await categoryResponse.json();
        const productsData = await productsResponse.json();

        setFoodCategories(['All', ...categoryData]); // Adding "All" to the categories
        setProducts(productsData);

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

  // Filter products based on selected tab
  const filteredProducts = selectedTab === 'All'
    ? products
    : products.filter(product => product.foodCategory === selectedTab);

  // Dummy data for metrics and orders
  const metrics = [
    { label: 'Food Saved', value: '500kg' },
    { label: 'Orders Made', value: '1000' },
    { label: 'Revenue Generated', value: '$15,000' },
    { label: 'New Customers', value: '50' },
  ];

  const orders = [
    { id: 1, product: 'Canned Beans', quantity: 100, status: 'Delivered' },
    { id: 2, product: 'Frozen Peas', quantity: 200, status: 'Pending' },
    { id: 3, product: 'Tomatoes', quantity: 150, status: 'Shipped' },
  ];

  return (
    <div className="p-4">
      {/* Store Title */}
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-3xl font-bold">Store</h1>

        {/* New Product Listing Button */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
          onClick={() => navigate('/create-product-listing')}
        >
          <AddIcon className="mr-2" /> New Product Listing
        </button>
      </div>

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
        <div className="p-4 bg-white rounded-lg shadow">
          {orders.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center h-16">
              <p className="text-gray-500">No Orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left">Product Listings</h2>
        <div className="p-4 bg-white rounded-lg shadow">
          {/* Products Listings */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white shadow rounded-lg p-4 cursor-pointer" // Added cursor-pointer for better UX
                  onClick={() => handleProductClick(product.productId)} // Navigate to product detail on click
                >
                  {/* Displaying the first image from productPictures if available */}
                  <img
                    src={product.productPictures.length > 0 ? product.productPictures[0] : 'placeholder-image-url'}
                    alt={product.listingTitle}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="text-lg font-bold mt-4">{product.listingTitle}</h3>
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
        </div>
      </div>
    </div>
  );
};
