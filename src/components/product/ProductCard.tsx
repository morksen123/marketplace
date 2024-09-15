import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { name, price, image, description, expiryDate } = product;
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // Here you would typically also update this state in your backend or global state management
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between relative">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={toggleFavorite}
          className={`p-1 rounded-full ${isFavorite ? 'bg-yellow-400' : 'bg-gray-200'} transition-colors duration-200`}
        >
          <Star size={20} className={isFavorite ? 'text-white' : 'text-gray-500'} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div>
        <img
          src={image || `/api/placeholder/200/200?text=${encodeURIComponent(name)}`}
          alt={name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h4 className="text-xl font-semibold mb-2">{name}</h4>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="text-green-600 font-bold">${price.toFixed(2)}</p>
        {expiryDate && (
          <p className="text-sm text-gray-500 mt-1">
            Best Before: {new Date(expiryDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center">
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;