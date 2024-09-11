import bannerImage from '@/assets/buyer-homepage-banner.png';

export const BuyerHome = () => {
  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: '$20',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Product 2',
      price: '$30',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Product 3',
      price: '$40',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'Product 4',
      price: '$50',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img src={bannerImage} alt="GudFood Banner" className="w-full h-auto" />
      </section>

      {/* Product Listings */}
      <section className="py-10">
        <h3 className="text-3xl text-left font-bold text-gray-800">
          Our Products
        </h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h4 className="text-xl font-semibold mt-4">{product.name}</h4>
              <p className="text-gray-600 mt-2">{product.price}</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
