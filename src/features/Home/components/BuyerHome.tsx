import bannerImage from '@/assets/buyer-homepage-banner.png';
import ProductCard from '@/components/product/ProductCard';

export const BuyerHome = () => {
  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: 20,
      image: 'https://via.placeholder.com/150',
      expiryDate: '2024-05-01',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 30,
      image: 'https://via.placeholder.com/150',
      expiryDate: '2024-05-01',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 40,
      image: 'https://via.placeholder.com/150',
      expiryDate: '2024-05-01',
    },
    {
      id: 4,
      name: 'Product 4',
      price: 50,
      image: 'https://via.placeholder.com/150',
      expiryDate: '2024-05-01',
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
