import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TreeDeciduous, Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';
import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/gudfood-logo.png';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { handleSuccessApi } from '@/lib/api-client';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  impactMetrics: {
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
  };
}

const fetchReferralLink = async () => {
  try {
    const response = await fetch('/api/buyer/referral-link', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch referral link');
    }

    const data = await response.json();
    return data.referralLink;
  } catch (error) {
    console.error('Error fetching referral link:', error);
    throw error;
  }
};

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, impactMetrics }) => {
  const [referralLink, setReferralLink] = useState('');
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchReferralLink().then(setReferralLink);
  }, []);

  const shareText = `Join me in my journey with GudFood and create an impact on the world! Sign up here: ${referralLink}`;
  const shareUrl = referralLink;

  const handleCopyImage = async () => {
    const element = document.getElementById('impact-card');
    if (!element) return;

    try {
      setIsCopying(true);
      const canvas = await html2canvas(element);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const data = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([data]);
            
            handleSuccessApi(
              "Success!",
              "Image copied to clipboard"
            );
          } catch (error) {
            console.error('Error copying image:', error);
            toast({
              title: "Error",
              description: "Failed to copy to clipboard. Try saving instead.",
              duration: 2000,
              variant: "destructive",
            });
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error creating image:', error);
      toast({
        title: "Error",
        description: "Failed to create shareable image",
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleSaveToGallery = async () => {
    const element = document.getElementById('impact-card');
    if (!element) return;

    try {
      setIsSaving(true);
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = 'gudfood-impact.png';
      link.href = dataUrl;
      link.click();
      
      handleSuccessApi(
        "Success!",
        "Image saved to your device"
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save image",
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Share Your Impact</DialogTitle>
          <DialogDescription>
            Copy or save the image to share your sustainability journey!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div id="impact-card" className="bg-gradient-to-br from-emerald-50 to-teal-100 p-8 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="GudFood Logo" className="h-12" />
              <h2 className="text-2xl font-bold">My Sustainability Impact</h2>
              <div className="h-12 w-[100px]"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Food Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6">
                <div className="flex flex-col items-center text-center">
                  <img src={food} alt="Food" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-1 font-medium">Food Rescued</h3>
                  <p className="text-4xl font-bold text-green-500 mb-4">
                    {impactMetrics.weightSaved.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    🍽️ {impactMetrics.mealsSaved.toFixed(0)} meals saved
                  </p>
                </div>
              </div>

              {/* Carbon Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6">
                <div className="flex flex-col items-center text-center">
                  <img src={co2} alt="CO2" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-1 font-medium">Carbon Impact</h3>
                  <p className="text-4xl font-bold text-green-500 mb-4">
                    {impactMetrics.co2Prevented.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    🚗 {impactMetrics.carKmEquivalent.toFixed(1)} km not driven
                  </p>
                </div>
              </div>

              {/* Energy Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6">
                <div className="flex flex-col items-center text-center">
                  <img src={electricity} alt="Electricity" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-1 font-medium">Energy Impact</h3>
                  <p className="text-4xl font-bold text-green-500 mb-4">
                    {impactMetrics.electricityDaysSaved.toFixed(1)} days
                  </p>
                  <p className="text-sm text-gray-600">
                    ❄️ {impactMetrics.acNightsSaved.toFixed(1)} nights of AC saved
                  </p>
                </div>
              </div>

              {/* Water Impact */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6">
                <div className="flex flex-col items-center text-center">
                  <img src={water} alt="Water" className="w-16 h-16 mb-3" />
                  <h3 className="text-gray-600 mb-1 font-medium">Water Saved</h3>
                  <p className="text-4xl font-bold text-green-500 mb-4">
                    {impactMetrics.waterLitresSaved >= 1000000000000
                      ? `${(impactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                      : impactMetrics.waterLitresSaved >= 1000000000
                        ? `${(impactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                        : impactMetrics.waterLitresSaved >= 1000000
                          ? `${(impactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                          : impactMetrics.waterLitresSaved.toFixed(0)
                  }
                  </p>
                  <p className="text-sm text-gray-600">
                    🚿 {impactMetrics.showersEquivalent.toFixed(1)} showers saved
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg text-gray-700 font-semibold mb-2">
                    Join me in my journey with GudFood and create an impact on the world!
                  </p>
                  <p className="text-base text-emerald-600 font-medium">
                    Scan to join with my referral link and earn 250 points on your first purchase!*
                  </p>
                  <p className="text-[10px] text-gray-400 mt-4">
                    *Terms and Conditions: Points will be credited with a minimum purchase. Valid for new customers only.
                  </p>
                </div>
                <div className="ml-6">
                  <QRCodeSVG
                    value={shareUrl}
                    size={120}
                    level="L"
                    includeMargin={false}
                    className="bg-white p-2 rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              onClick={handleCopyImage} 
              variant="secondary"
              className="button-green"
              disabled={isCopying}
            >
              {isCopying ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full border-2 border-gray-200 border-t-green-500 h-4 w-4" />
                  <span>Copying...</span>
                </div>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Copy Image</span>
                </>
              )}
            </Button>
            <Button 
              onClick={handleSaveToGallery}
              variant="secondary" 
              className="button-green"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full border-2 border-gray-200 border-t-green-500 h-4 w-4" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Save to Gallery</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
