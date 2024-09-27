import React, { useEffect, useState } from 'react';
import { Product } from '@/features/ProductListing/constants';

export const InventoryManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/distributor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.productId} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{product.listingTitle}</h2>
            <p>Category: {product.foodCategory}</p>
            <p>Condition: {product.foodCondition}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            {/* Add more product details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};