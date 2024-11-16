import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeDeciduous } from 'lucide-react';
import { motion } from 'framer-motion';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';
import { useState } from 'react';
import { ShareDialog } from './Share';

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
  userType: 'distributor' | 'buyer';
}

export const SustainabilityImpact = ({ impactMetrics, onImpactCardClick, cardVariants, userType }: SustainabilityImpactProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/join`;
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);


  if (!impactMetrics) return null;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 h-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              Your Sustainability Impact
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareDialogOpen(true)}
              className="ml-auto"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Impact
            </Button>
          </div>
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
                  <p className="text-4xl font-bold text-green-500 mb-2">
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
                  <p className="text-4xl font-bold text-green-500 mb-2">
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
                  <p className="text-4xl font-bold text-green-500 mb-2">
                    {impactMetrics.electricityDaysSaved.toFixed(1)} nights
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
                  <p className="text-4xl font-bold text-green-500 mb-2">
                    {impactMetrics.waterLitresSaved >= 1000000000000
                      ? `${(impactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                      : impactMetrics.waterLitresSaved >= 1000000000
                      ? `${(impactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                      : impactMetrics.waterLitresSaved >= 1000000
                      ? `${(impactMetrics.waterLitresSaved / 1000000).toFixed(1)} mil`
                      : impactMetrics.waterLitresSaved.toFixed(0)
                    } ℓ
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
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        impactMetrics={impactMetrics}
        userType={userType}
      />
    </motion.div>
  );
}; 