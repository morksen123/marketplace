import { Card, CardContent } from '@/components/ui/card';
import { Gift, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { handleErrorApi, handleSuccessApi } from '@/lib/api-client';

interface RewardConfiguration {
  voucherPointsCost: number;
  voucherValue: number;
}

interface Profile {
  savedPoints: number;
}

interface RewardsProps {
  onClose?: () => void;
}

export const Rewards: React.FC<RewardsProps> = ({ onClose }) => {
  const [rewardConfig, setRewardConfig] = useState<RewardConfiguration | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedVouchers, setSelectedVouchers] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardResponse, profileResponse] = await Promise.all([
          fetch('/api/rewards/rewards-details', {
            credentials: 'include',
          }),
          fetch('/api/buyer/profile', {
            credentials: 'include',
          })
        ]);

        if (!rewardResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const rewardData = await rewardResponse.json();
        const profileData = await profileResponse.json();

        setRewardConfig(rewardData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedeemVouchers = async () => {
    if (!profile || !rewardConfig) return;
    
    setIsRedeeming(true);
    try {
      const response = await fetch(`/api/buyer/redeem-voucher?quantity=${selectedVouchers}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          voucherCount: selectedVouchers,
          pointsCost: selectedVouchers * rewardConfig.voucherPointsCost
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to redeem vouchers');
      }

      handleSuccessApi('Success', `Successfully redeemed ${selectedVouchers} voucher${selectedVouchers > 1 ? 's' : ''}`);
      
      // Refresh the entire page
      window.location.reload();
      
    } catch (error) {
      console.error('Error redeeming vouchers:', error);
      handleErrorApi('Error', 'Failed to redeem vouchers');
    } finally {
      setIsRedeeming(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (isLoading || !rewardConfig || !profile) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  const maxVouchers = Math.floor(profile.savedPoints / rewardConfig.voucherPointsCost);
  const pointsNeededForNext = maxVouchers === 0 
    ? rewardConfig.voucherPointsCost - profile.savedPoints
    : rewardConfig.voucherPointsCost - (profile.savedPoints % rewardConfig.voucherPointsCost);

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Gift className="h-5 w-5" />
        Redeem Store Credit
      </h2>

      <div>
        <Card className="bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 relative overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <motion.div 
                className="mb-8 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold text-gray-800">Your Redeemable Points</h3>
                <p className="text-5xl font-bold text-green-600 mt-3 flex items-center justify-center gap-2">
                  {profile.savedPoints}
                  <span className="text-lg text-gray-600">points</span>
                </p>
              </motion.div>

              <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-md relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Redeem Now
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-lg mb-4">Store Credit Vouchers</h4>
                  <p className="text-gray-600 mb-6">
                    Each ${rewardConfig.voucherValue} voucher costs <span className="font-semibold text-green-600">{rewardConfig.voucherPointsCost}</span> points
                  </p>

                  <div className="flex items-center justify-center gap-6 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVouchers(Math.max(1, selectedVouchers - 1))}
                      disabled={selectedVouchers <= 1}
                      className="h-10 w-10 rounded-full"
                    >
                      -
                    </Button>
                    <div className="text-2xl font-bold text-gray-800 w-16 text-center">
                      {selectedVouchers}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVouchers(Math.min(maxVouchers, selectedVouchers + 1))}
                      disabled={selectedVouchers >= maxVouchers}
                      className="h-10 w-10 rounded-full"
                    >
                      +
                    </Button>
                  </div>

                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={maxVouchers === 0 || isRedeeming}
                    onClick={handleRedeemVouchers}
                  >
                    {isRedeeming ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Redeeming...
                      </div>
                    ) : (
                      <>
                        Redeem ${rewardConfig.voucherValue * selectedVouchers} Store Credit
                        {maxVouchers > 0 && ` (${selectedVouchers * rewardConfig.voucherPointsCost} points)`}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {maxVouchers === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 w-full"
                  >
                    <Alert className="bg-orange-50 border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <AlertTitle className="text-orange-800">Not Enough Points</AlertTitle>
                      <AlertDescription className="text-orange-700">
                        You need {pointsNeededForNext} more points to redeem a ${rewardConfig.voucherValue} voucher
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                ) : (
                  <motion.p 
                    className="text-sm text-gray-600 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    You only need {pointsNeededForNext} more points to redeem an additional ${rewardConfig.voucherValue} voucher
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}; 