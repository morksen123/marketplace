import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/gudfood-logo.png';
import { useState, useEffect } from 'react';
import { handleSuccessApi } from '@/lib/api-client';
import SustainabilityIcon from '@/assets/forest.png';
import LeaderboardIcon from '@/assets/podium.png';
import QualityIcon from '@/assets/rating.png';

interface BadgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    badgeId: number;
    title: string;
    subtitle: string;
    criteria: string;
    earnedOn: string;
    category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
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

export const BadgeDialog: React.FC<BadgeDialogProps> = ({ isOpen, onClose, badge }) => {
  const [referralLink, setReferralLink] = useState('');
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchReferralLink().then(setReferralLink);
  }, []);

  const getBadgeIcon = () => {
    switch (badge.category) {
      case 'SUSTAINABILITY':
        return SustainabilityIcon;
      case 'LEADERBOARD':
        return LeaderboardIcon;
      case 'QUALITY_ENGAGEMENT':
      case 'QUALITY_SERVICE':
        return QualityIcon;
    }
  };

  const getBadgeGradient = () => {
    switch (badge.category) {
      case 'SUSTAINABILITY':
        return 'from-green-50 to-emerald-100';
      case 'LEADERBOARD':
        return 'from-yellow-50 to-amber-100';
      case 'QUALITY_ENGAGEMENT':
        return 'from-blue-50 to-indigo-100';
      case 'QUALITY_SERVICE':
        return 'from-purple-50 to-violet-100';
    }
  };

  const handleCopyImage = async () => {
    const element = document.getElementById('badge-card');
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
    const element = document.getElementById('badge-card');
    if (!element) return;

    try {
      setIsSaving(true);
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `gudfood-badge-${badge.title.toLowerCase().replace(/\s+/g, '-')}.png`;
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
          <DialogTitle>Share Your Badge</DialogTitle>
          <DialogDescription>
            Copy or save the image to share your achievement!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div id="badge-card" className={`bg-gradient-to-br ${getBadgeGradient()} p-8 rounded-xl`}>
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="GudFood Logo" className="h-12" />
              <h2 className="text-2xl font-bold">I just earned the {badge.title} badge!</h2>
              <div className="h-12 w-[100px]"></div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-32 h-32 p-6 bg-white/80 rounded-full shadow-lg">
                <img src={getBadgeIcon()} alt="Badge Icon" className="w-full h-full" />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold">{badge.title}</h3>
                <p className="text-lg text-gray-700">{badge.criteria}</p>
                <p className="text-sm text-gray-600">
                  Earned on {new Date(badge.earnedOn).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg text-gray-700 font-semibold mb-2">
                    Join me in my sustainability journey with GudFood!
                  </p>
                  <p className="text-base text-emerald-600 font-medium">
                    Scan to join with my referral link or go to <u>{referralLink}</u> and earn 250 points on your first purchase!*
                  </p>
                  <p className="text-[10px] text-gray-400 mt-4">
                    *Terms and Conditions: Points will be credited with a minimum purchase. Valid for new customers only.
                  </p>
                </div>
                <div className="ml-6">
                  <QRCodeSVG
                    value={referralLink}
                    size={120}
                    level="L"
                    includeMargin={false}
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
