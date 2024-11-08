import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeDeciduous } from 'lucide-react';
import { motion } from 'framer-motion';
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';

interface ImpactMetricsDto {
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

interface SustainabilityImpactProps {
  impactMetrics: ImpactMetricsDto | null;
  onImpactCardClick: (category: 'food' | 'water' | 'electricity' | 'carbon', type: 'personal' | 'community') => void;
  cardVariants: any;
}

export const SustainabilityImpact = ({ impactMetrics, onImpactCardClick, cardVariants }: SustainabilityImpactProps) => {
  if (!impactMetrics) return null;

  return (
    <motion.div variants={cardVariants}>
      <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreeDeciduous className="h-5 w-5" />
            Your Sustainability Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Food Rescued Card */}
            <div 
              className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onImpactCardClick('food', 'personal')}
            >
              <div className="flex flex-col items-center text-center">
                <img src={food} alt="Food" className="w-16 h-16 mb-3" />
                <div>
                  <h3 className="text-gray-600 mb-2 font-medium">Food Rescued</h3>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    {impactMetrics.weightSaved.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    🍽️ {impactMetrics.mealsSaved.toFixed(0)} meals saved
                  </p>
                </div>
              </div>
            </div>

            {/* Carbon Impact Card */}
            <div 
              className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onImpactCardClick('carbon', 'personal')}
            >
              <div className="flex flex-col items-center text-center">
                <img src={co2} alt="CO2" className="w-16 h-16 mb-3" />
                <div>
                  <h3 className="text-gray-600 mb-2 font-medium">Carbon Impact</h3>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    {impactMetrics.co2Prevented.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    🚗 {impactMetrics.carKmEquivalent.toFixed(1)} km not driven
                  </p>
                </div>
              </div>
            </div>

            {/* Energy Impact Card */}
            <div 
              className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onImpactCardClick('electricity', 'personal')}
            >
              <div className="flex flex-col items-center text-center">
                <img src={electricity} alt="Electricity" className="w-16 h-16 mb-3" />
                <div>
                  <h3 className="text-gray-600 mb-2 font-medium">Energy Impact</h3>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    {impactMetrics.acNightsSaved.toFixed(1)} nights
                  </p>
                  <p className="text-sm text-gray-600">
                    ❄️ {impactMetrics.acNightsSaved.toFixed(1)} nights of AC saved
                  </p>
                </div>
              </div>
            </div>

            {/* Water Saved Card */}
            <div 
              className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onImpactCardClick('water', 'personal')}
            >
              <div className="flex flex-col items-center text-center">
                <img src={water} alt="Water" className="w-16 h-16 mb-3" />
                <div>
                  <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    {impactMetrics.waterLitresSaved.toFixed(0)} litres
                  </p>
                  <p className="text-sm text-gray-600">
                    🚿 {impactMetrics.showersEquivalent.toFixed(0)} showers saved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 