import { Card, CardContent } from '@/components/ui/card';
import { Gift, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { handleErrorApi, handleSuccessApi } from '@/lib/api-client';

interface RewardConfiguration {
  boostPointsCost: number;
}

interface Profile {
  savedPoints: number;
  boostCount: number;
}

interface RedeemBoostsProps {
  onClose?: () => void;
}

export const RedeemBoosts: React.FC<RedeemBoostsProps> = ({ onClose }) => {
  const [rewardConfig, setRewardConfig] = useState<RewardConfiguration | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedBoosts, setSelectedBoosts] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardResponse, profileResponse] = await Promise.all([
          fetch('/api/rewards/rewards-details', {
            credentials: 'include',
          }),
          fetch('/api/distributor/profile', {
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

  const handleRedeemBoosts = async () => {
    if (!profile || !rewardConfig) return;
    
    setIsRedeeming(true);
    try {
      const response = await fetch(`/api/distributor/redeem-boost?quantity=${selectedBoosts}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          boostCount: selectedBoosts,
          pointsCost: selectedBoosts * rewardConfig.boostPointsCost
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to redeem boosts');
      }

      handleSuccessApi('Success', `Successfully redeemed ${selectedBoosts} boost${selectedBoosts > 1 ? 's' : ''}`);
      
      // Refresh the entire page
      window.location.reload();
      
    } catch (error) {
      console.error('Error redeeming boosts:', error);
      handleErrorApi('Error', 'Failed to redeem boosts');
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

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  if (isLoading || !rewardConfig || !profile) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  const maxBoosts = Math.floor(profile.savedPoints / rewardConfig.boostPointsCost);
  const pointsNeededForNext = maxBoosts === 0 
    ? rewardConfig.boostPointsCost - profile.savedPoints
    : rewardConfig.boostPointsCost - (profile.savedPoints % rewardConfig.boostPointsCost);

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Gift className="h-5 w-5" />
        Redeem Product Boosts
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
                  <h4 className="font-semibold text-lg mb-4">Product Boosts</h4>
                  <p className="text-gray-600 mb-6">
                    Each boost costs <span className="font-semibold text-green-600">{rewardConfig.boostPointsCost}</span> points
                  </p>

                  <div className="flex items-center justify-center gap-6 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBoosts(Math.max(1, selectedBoosts - 1))}
                      disabled={selectedBoosts <= 1}
                      className="h-10 w-10 rounded-full"
                    >
                      -
                    </Button>
                    <div className="text-2xl font-bold text-gray-800 w-16 text-center">
                      {selectedBoosts}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBoosts(Math.min(maxBoosts, selectedBoosts + 1))}
                      disabled={selectedBoosts >= maxBoosts}
                      className="h-10 w-10 rounded-full"
                    >
                      +
                    </Button>
                  </div>

                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={maxBoosts === 0 || isRedeeming}
                    onClick={handleRedeemBoosts}
                  >
                    {isRedeeming ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Redeeming...
                      </div>
                    ) : (
                      <>
                        Redeem {selectedBoosts} Boost{selectedBoosts > 1 ? 's' : ''}
                        {maxBoosts > 0 && ` (${selectedBoosts * rewardConfig.boostPointsCost} points)`}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {maxBoosts === 0 ? (
                  <>
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
                        You need {pointsNeededForNext} more points to redeem a boost
                      </AlertDescription>
                    </Alert>
                  </motion.div>

                  <motion.p
                    className="text-base text-black mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    You have <span className="text-green-500 font-bold">{profile.boostCount}</span> boosts available
                  </motion.p>
                  </>
                ) : (
                  <>
                    <motion.p 
                      className="text-sm text-gray-600 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    You only need {pointsNeededForNext} more points to redeem an additional boost
                  </motion.p>
                  <motion.p
                    className="text-base text-black mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    You have <span className="text-green-500 font-bold">{profile.boostCount}</span> boosts available
                  </motion.p>
                  </>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}; 