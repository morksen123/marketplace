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
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/join`;

  const createShareMessage = () => {
    return `Check out my sustainability impact! 🌱\n\n` +
           `🍽️ Food Rescued: ${impactMetrics?.weightSaved.toFixed(1)} kg\n` +
           `🌳 CO2 Prevented: ${impactMetrics?.co2Prevented.toFixed(1)} kg\n` +
           `⚡ Energy Saved: ${impactMetrics?.acNightsSaved.toFixed(1)} nights\n` +
           `💧 Water Saved: ${impactMetrics?.waterLitresSaved.toFixed(0)} L\n\n` +
           `Join me in making a difference!`;
  };

  const shareToSocialMedia = (platform: 'linkedin' | 'facebook' | 'instagram') => {
    const message = createShareMessage();
    const shareUrl = baseUrl;

    switch (platform) {
      case 'linkedin': {
        const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
        linkedInUrl.searchParams.append('url', shareUrl);
        window.open(
          linkedInUrl.toString(),
          'LinkedInShare',
          'width=800,height=600,menubar=no,toolbar=no,status=no'
        );
        break;
      }
      case 'facebook': {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=600');
        break;
      }
      case 'instagram': {
        navigator.clipboard.writeText(message)
          .then(() => {
            toast({
              title: "Instagram Sharing",
              description: "Impact metrics copied! Share a screenshot of your stats along with the copied message on Instagram.",
              duration: 5000,
            });
          })
          .catch((error) => console.error("Clipboard error:", error));
        break;
      }
    }
  };

  if (!impactMetrics) return null;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 h-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              Your Sustainability Impact
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Impact</DialogTitle>
                  <DialogDescription>
                    Share your sustainability impact on social media
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => shareToSocialMedia('linkedin')} variant="outline">
                      Share on LinkedIn
                    </Button>
                    <Button onClick={() => shareToSocialMedia('facebook')} variant="outline">
                      Share on Facebook
                    </Button>
                    <Button onClick={() => shareToSocialMedia('instagram')} variant="outline">
                      Share on Instagram
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
    </motion.div>
  );
}; 