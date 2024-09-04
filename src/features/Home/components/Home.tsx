import React from 'react';

export const Home = () => {
  const products = [
    { id: 1, name: 'Product 1', price: '$20', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: '$30', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: '$40', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', price: '$50', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div>
      {/* Header */}
      <header className="bg-green-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">GudFood Marketplace</h1>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow p-4">
        <ul className="flex justify-center space-x-6 text-lg">
          <li><a href="/" className="text-green-600 hover:text-green-800">Home</a></li>
          <li><a href="/products" className="text-green-600 hover:text-green-800">Products</a></li>
          <li><a href="/about" className="text-green-600 hover:text-green-800">About</a></li>
          <li><a href="/contact" className="text-green-600 hover:text-green-800">Contact</a></li>
          <li><a href="/create-product-listing" className="text-green-600 hover:text-green-800">Create Product Listing</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-100 py-20 text-center">
        <h2 className="text-4xl font-bold text-green-600">Welcome to GudFood</h2>
        <p className="mt-4 text-lg text-gray-700">
          Shop surplus food at affordable prices while helping to reduce food waste.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-800">
          Shop Now
        </button>
      </section>

      {/* Product Listings */}
      <section className="py-10">
        <h3 className="text-3xl text-center font-bold text-gray-800">Our Products</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h4 className="text-xl font-semibold mt-4">{product.name}</h4>
              <p className="text-gray-600 mt-2">{product.price}</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 GudFood. All rights reserved.</p>
      </footer>
    </div>
  );
};