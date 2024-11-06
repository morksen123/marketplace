import ProductCard from '@/components/product/ProductCard';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';
import { Product } from '@/features/ProductCatalogue/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, TreePine, Factory, Lightbulb } from 'lucide-react';

// Update the interface
interface ImpactMetricsDto {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
}

export const BuyerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { favourites, toggleFavourite, checkFavourite } = useFavourites();
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetricsDto | null>(null);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/active', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data: Product[] = await response.json();

          // Sort products
          const sortedProducts = data.sort((a, b) => {
            // First, prioritize boosted products
            if (a.boostStatus === 'ACTIVE' && b.boostStatus !== 'ACTIVE')
              return -1;
            if (b.boostStatus === 'ACTIVE' && a.boostStatus !== 'ACTIVE')
              return 1;

            // Then, sort by bestBeforeDate of the first batch
            const aDate = new Date(a.batches[0]?.bestBeforeDate || '');
            const bDate = new Date(b.batches[0]?.bestBeforeDate || '');
            return aDate.getTime() - bDate.getTime();
          });

          setProducts(sortedProducts);
          // console.log(sortedProducts);
          sortedProducts.forEach((product: Product) => {
            checkFavourite(product.productId);
          });
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Add new useEffect for fetching impact metrics
  useEffect(() => {
    const fetchImpactMetrics = async () => {
      try {
        const response = await fetch('/api/impact/community', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setImpactMetrics(data);
        } else {
          console.error('Failed to fetch impact metrics');
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      }
    };

    fetchImpactMetrics();
  }, []);

  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  return (
    <div className="pb-12">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-50 py-12"
      >
        <div className="wrapper">
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-2"
          >
            <span>Our Community Impact</span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🌍
            </motion.span>
          </motion.h2>

          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* Food Saved Metric */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-green-100 rounded-full">
                  <Apple className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600">
                  {impactMetrics?.weightSaved.toFixed(1) || 0} kg
                </h3>
                <p className="text-gray-600">Food Waste Prevented</p>
              </div>
            </motion.div>

            {/* CO2 Prevented Metric */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Factory className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">
                  {impactMetrics?.co2Prevented?.toFixed(1) || 0} kg
                </h3>
                <p className="text-gray-600">CO₂ Emissions Prevented</p>
              </div>
            </motion.div>

            {/* Trees Equivalent Metric */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TreePine className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {impactMetrics?.treesEquivalent?.toFixed(1) || 0}
                </h3>
                <p className="text-gray-600">Trees Equivalent Saved</p>
              </div>
            </motion.div>

            {/* Electricity Days Saved Metric */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600">
                  {impactMetrics?.electricityDaysSaved?.toFixed(1) || 0}
                </h3>
                <p className="text-gray-600">Days of Electricity Saved</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6 text-gray-600 italic"
          >
            Together, we're making a difference! 🌱
          </motion.p>
        </div>
      </motion.section>

      <section className="wrapper mt-10">
        {/* To refactor ProductCard */}
        <h3 className="text-3xl text-left font-bold text-gray-800">
          Our Products
        </h3>
        {/* Products Listings */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                isFavourite={favourites?.some(
                  (fav) => fav.productId === product.productId,
                )}
                onToggleFavourite={() => toggleFavourite(product.productId)}
                onProductClick={handleProductClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-gray-500">No Products</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
