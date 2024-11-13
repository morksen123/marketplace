import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TreeDeciduous, Recycle, Heart, Users } from 'lucide-react';
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';
import { useEffect, useState } from 'react';

interface CommunityImpact {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
  mealsSaved: number;
  waterLitresSaved: number;
}

export const AboutUs = () => {
  const [impactMetrics, setImpactMetrics] = useState<CommunityImpact | null>(null);

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
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      }
    };

    fetchImpactMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="pt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Creating a More Sustainable Future
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            At GudFood, we're on a mission to combat food waste by bridging the gap between 
            distributors and buyers, creating a marketplace where surplus food finds its purpose.
          </p>
        </motion.div>
      </section>

      {/* Mission Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-none shadow-lg h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <TreeDeciduous className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Environmental Impact</h3>
                <p className="text-gray-700 flex-1">
                  Reducing food waste to minimize greenhouse gas emissions and conserve valuable resources.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-none shadow-lg h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <Recycle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sustainable Solutions</h3>
                <p className="text-gray-700 flex-1">
                  Creating an efficient marketplace to redistribute surplus and near-expiry products.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-none shadow-lg h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Community Focus</h3>
                <p className="text-gray-700 flex-1">
                  Building a network of environmentally conscious businesses and consumers.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Community Impact Section */}
      {impactMetrics && (
        <section className="py-16 px-4 bg-white/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Food Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <img src={food} alt="Food" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-2 font-medium">Food Rescued</h3>
                  <p className="text-4xl font-bold text-emerald-600">
                    {impactMetrics.weightSaved.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    🍽️ {impactMetrics.mealsSaved.toFixed(0)} meals saved
                  </p>
                </div>
              </div>

              {/* Carbon Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <img src={co2} alt="CO2" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-2 font-medium">Carbon Impact</h3>
                  <p className="text-4xl font-bold text-emerald-600">
                    {impactMetrics.co2Prevented.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    🌳 {impactMetrics.treesEquivalent.toFixed(0)} trees equivalent
                  </p>
                </div>
              </div>

              {/* Energy Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <img src={electricity} alt="Electricity" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-2 font-medium">Energy Saved</h3>
                  <p className="text-4xl font-bold text-emerald-600">
                    {impactMetrics.electricityDaysSaved.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    ⚡ days of electricity
                  </p>
                </div>
              </div>

              {/* Water Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <img src={water} alt="Water" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                  <p className="text-4xl font-bold text-emerald-600">
                    {impactMetrics.waterLitresSaved >= 1000000000000
                      ? `${(impactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                      : impactMetrics.waterLitresSaved >= 1000000000
                        ? `${(impactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                        : impactMetrics.waterLitresSaved >= 1000000
                          ? `${(impactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                          : impactMetrics.waterLitresSaved.toFixed(0)
                    } ℓ
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    💧 of water conserved
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Join Us Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Whether you're a distributor looking to minimize waste or a business / individual seeking sustainable 
            options, be part of our growing community making a real difference.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
              Join as Distributor
            </button>
            <button className="px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-full hover:bg-emerald-50 transition-colors">
              Join as Buyer
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
