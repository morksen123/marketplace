import React, { useState } from 'react';
import { Button, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export const DistributorHome = () => {
  const navigate = useNavigate();

  // Dummy data for metrics and orders
  const metrics = [
    { label: 'Food Saved', value: '500kg' },
    { label: 'Orders Made', value: '1000' },
    { label: 'Revenue Generated', value: '$15,000' },
    { label: 'New Customers', value: '50' }
  ];

  const orders = [
    { id: 1, product: 'Canned Beans', quantity: 100, status: 'Delivered' },
    { id: 2, product: 'Frozen Peas', quantity: 200, status: 'Pending' },
    { id: 3, product: 'Tomatoes', quantity: 150, status: 'Shipped' },
  ];

  const [selectedTab, setSelectedTab] = useState('All');
  const tabs = ['All', 'New', 'Fruits & Vegetables', 'Canned Goods', 'Frozen', 'Expiring'];

  return (
    <div className="p-4">
      {/* Store Title */}
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-3xl font-bold">Store</h1>

        {/* New Product Listing Button */}
        <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
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
      </div>

      {/* Tabs Menu */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left">Product Listings</h2>
        <div className="bg-white w-full">
          <div className="flex justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-4 px-4 text-black focus:outline-none flex-grow ${selectedTab === tab
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'hover:text-green-500'
                  }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};