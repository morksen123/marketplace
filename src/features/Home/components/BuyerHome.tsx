import ProductCard from '@/components/product/ProductCard';
import { useFavourites } from '@/features/BuyerAccount/hooks/useFavourites';
import { Product } from '@/features/ProductCatalogue/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ImpactGoalsProgress } from './ImpactGoalsProgress'
import food from '@/assets/food.png'
import co2 from '@/assets/co2.png'
import electricity from '@/assets/electricity.png'
import { Card, CardContent } from '@/components/ui/card';
import bannerImage from '@/assets/buyer-homepage-banner.png';
import { TreeDeciduous, Recycle } from 'lucide-react';
import water from '@/assets/water.png'
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ImpactExplanation } from '@/features/Sustainability/Profile/components/ImpactExplanation';

// Update the interface
interface ImpactMetrics {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
  acNightsSaved: number;
  mealsSaved: number;
  waterLitresSaved: number;
  showersEquivalent: number;
  swimmingPoolsEquivalent: number;
  carKmEquivalent: number;
}

export const BuyerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { favourites, toggleFavourite, checkFavourite } = useFavourites();
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics>({
    weightSaved: 0,
    co2Prevented: 0,
    treesEquivalent: 0,
    electricityDaysSaved: 0,
    acNightsSaved: 0,
    mealsSaved: 0,
    waterLitresSaved: 0,
    showersEquivalent: 0,
    swimmingPoolsEquivalent: 0,
    carKmEquivalent: 0
  });
  const [personalImpactMetrics, setPersonalImpactMetrics] = useState<ImpactMetrics>({
    weightSaved: 0,
    co2Prevented: 0,
    treesEquivalent: 0,
    electricityDaysSaved: 0,
    acNightsSaved: 0,
    mealsSaved: 0,
    waterLitresSaved: 0,
    showersEquivalent: 0,
    swimmingPoolsEquivalent: 0,
    carKmEquivalent: 0
  });
  const [selectedImpact, setSelectedImpact] = useState<{
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null>(null);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotate: 0
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: [-2, 1, -1, 2][i % 4],
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

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
          credentials: 'include'
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

    const fetchPersonalImpactMetrics = async () => {
      try {
        const response = await fetch('/api/impact/personal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setPersonalImpactMetrics(data);
        } else {
          console.error('Failed to fetch impact metrics');
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      }
    };

    fetchImpactMetrics();
    fetchPersonalImpactMetrics();
  }, []);

  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/buyer/view-product/${productId}`);
  };

  const handleImpactCardClick = (
    category: 'food' | 'water' | 'electricity' | 'carbon',
    type: 'personal' | 'community'
  ) => {
    setSelectedImpact({ category, type });
  };

  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-[80%] lg:mx-auto p-8 md:px-10 xl:px-0">
        {/* Quote Card - Dark Theme */}
        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#14171F] text-white h-full relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 leading-tight">
                  "Cutting food waste is a delicious way of saving money, helping to feed the world and protect the planet."
                </h2>
                <p className="text-lg text-gray-300 italic">
                  – Tristram Stuart
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Community Goals - Moved up */}
        <motion.div
          className="md:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ImpactGoalsProgress weightSaved={impactMetrics.weightSaved} />
        </motion.div>

        {/* Impact Statistics Cards - Split into Personal and Community */}
        <motion.div
          className="md:col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Personal Impact */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TreeDeciduous className="h-6 w-6 text-emerald-600" />
                  Your Environmental Hero Journey
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {/* Food Rescued Card */}
                  <div 
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('food', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={food} alt="Food" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Food Rescued</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.weightSaved.toFixed(1)} kg</p>
                        <p className="text-base text-black-600">
                          🍽️ {personalImpactMetrics.mealsSaved.toFixed(0)} meals saved
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carbon Impact Card */}
                  <div 
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('carbon', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={co2} alt="CO2" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Carbon Impact</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.co2Prevented.toFixed(1)} kg</p>
                        <p className="text-base text-black-600">
                          🚗 {personalImpactMetrics.carKmEquivalent.toFixed(1)} km not driven
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Energy Impact Card */}
                  <div 
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('electricity', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={electricity} alt="Electricity" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Energy Impact</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.electricityDaysSaved.toFixed(1)} days</p>
                        <p className="text-base text-black-600">
                          ❄️ {personalImpactMetrics.acNightsSaved.toFixed(1)} nights of AC
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Water Impact Card */}
                  <div 
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('water', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={water} alt="Water" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                        <p className="text-3xl font-bold text-emerald-600">
                          <b>
                            {personalImpactMetrics.waterLitresSaved >= 1000000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                              : personalImpactMetrics.waterLitresSaved >= 1000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                              : personalImpactMetrics.waterLitresSaved >= 1000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                              : personalImpactMetrics.waterLitresSaved.toFixed(0)
                            }
                          </b> ℓ
                        </p>
                        <p className="text-base text-black-600">
                          🚿 {personalImpactMetrics.showersEquivalent.toFixed(0)} showers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-blue-600" />
                  Our Collective Impact
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                                      onClick={() => handleImpactCardClick('food', 'community')}>
                    <div className="flex flex-col items-center text-center">
                      <img src={food} alt="Food" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Food Rescue</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.weightSaved.toFixed(1)}</b> kg</p>
                        <p className="text-base text-black-600">
                          🍽️ Feeds <b>{impactMetrics.weightSaved.toFixed(0)}</b> people
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('carbon', 'community')}
                    >
                    <div className="flex flex-col items-center text-center">
                      <img src={co2} alt="CO2" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Carbon Prevention</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.co2Prevented.toFixed(1)}</b> kg</p>
                        <p className="text-base text-black-600">
                          🌳 <b>{impactMetrics.treesEquivalent.toFixed(0)}</b> trees planted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('electricity', 'community')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={electricity} alt="Electricity" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Energy Savings</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.electricityDaysSaved.toFixed(1)}</b> days</p>
                        <p className="text-base text-black-600">
                          🏠 Powers <b>{(impactMetrics.electricityDaysSaved * 0.1).toFixed(0)}</b> homes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('water', 'community')}
                  > 
                    <div className="flex flex-col items-center text-center">
                      <img src={water} alt="Water" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          <b>
                            {personalImpactMetrics.waterLitresSaved >= 1000000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                              : personalImpactMetrics.waterLitresSaved >= 1000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                              : personalImpactMetrics.waterLitresSaved >= 1000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                              : personalImpactMetrics.waterLitresSaved.toFixed(0)
                            }
                          </b> ℓ
                        </p>
                        <p className="text-base text-black-600">
                          🏊‍♂️ <b>{personalImpactMetrics.swimmingPoolsEquivalent.toFixed(0)}</b> Olympic swimming pools
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Products section with wrapper class */}
      <section className="wrapper mt-10">
        <h3 className="text-3xl text-left font-bold text-gray-800">
          Our Products
        </h3>
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

      <Dialog 
        open={selectedImpact !== null} 
        onOpenChange={() => setSelectedImpact(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedImpact && (
            <ImpactExplanation 
              category={selectedImpact.category} 
              type={selectedImpact.type}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
