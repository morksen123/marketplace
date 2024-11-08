import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  EmojiEvents as Trophy,
  Park as TreeDeciduous,
  WaterDrop as Droplets,
  Battery90 as Battery,
  Recycling as Recycle,
  Star,
  WorkspacePremium as Medal,
  CalendarMonth as Calendar,
  Grade as LeaderboardIcon,
  CardGiftcard as Gift,
  Share,
  ContentCopy as Copy,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { PointsHistory } from './components/PointsHistoryTable';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';
import { ImpactExplanation } from './components/ImpactExplanation';
import { ShareContent } from './components/Share';
import { SustainabilityImpact } from './components/SustainabilityImpact';
interface Profile {
  points: number;
  firstName: string;
  lastName: string;
  referralCode?: string;
  referredByCode?: string;
  hasQualifyingPurchase: boolean;
}

interface Badge {
  badgeId: number;
  title: string;
  subtitle: string;
  criteria: string;
  earnedOn: string;
  category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
}

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

const fetchProfile = async () => {
  try {
    const response = await fetch('/api/buyer/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

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

const fetchBadges = async () => {
  try {
    const response = await fetch('/api/buyer/badges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch badges');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    points: 0,
    firstName: '',
    lastName: '',
    referralCode: '',
    hasQualifyingPurchase: false
  });
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralCodeInput, setReferralCodeInput] = useState<string>('');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetricsDto | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<{
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      console.log(data);
      setProfile(data);
    };
    const getReferralLink = async () => {
      const link = await fetchReferralLink();
      setReferralLink(link);
    };
    const getBadges = async () => {
      const badgeData = await fetchBadges();
      setBadges(badgeData);
    };
    const fetchImpactMetrics = async () => {
      try {
        const response = await fetch('/api/impact/personal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
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
    getProfile();
    getReferralLink();
    getBadges();
    fetchImpactMetrics();
  }, []);

  const handleSubmitReferralCode = async () => {
    try {
      const response = await fetch('/api/buyer/referral-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ referralCode: referralCodeInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply referral code');
      }

      toast({
        title: "Success!",
        description: "Referral code applied successfully.",
        duration: 2000,
      });

      // Refresh profile data
      const updatedProfile = await fetchProfile();
      setProfile(updatedProfile);
      setReferralCodeInput(''); // Clear input after successful submission
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to apply referral code",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };


  const handleImpactCardClick = (
    category: 'food' | 'water' | 'electricity' | 'carbon',
    type: 'personal' | 'community'
  ) => {
    setSelectedImpact({ category, type });
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header Card */}
      <motion.div variants={cardVariants} className="mb-8">
        <Card className="bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Profile Info Circle */}
              <motion.div 
                className="relative w-48 h-48"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-10" />
                <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                </div>
              </motion.div>

              {/* Points Circle */}
              <motion.div 
                className="relative w-40 h-40"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-10" />
                <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-green-600">{profile.points}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </motion.div>

              {/* Referral Section */}
              <div className="flex flex-col gap-4">
                {!profile.referredByCode && !profile.hasQualifyingPurchase && (
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Input
                      placeholder="Enter referral code"
                      value={referralCodeInput}
                      onChange={(e) => setReferralCodeInput(e.target.value)}
                      className="w-40 rounded-full"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSubmitReferralCode}
                      className="rounded-full"
                    >
                      Apply
                    </Button>
                  </motion.div>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share Referral Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Your Referral Code</DialogTitle>
                      <DialogDescription>
                        Share this code with friends and earn rewards when they sign up!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={profile.referralCode || ''}
                          className="font-mono"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(profile.referralCode || '');
                            toast({
                              title: "Success!",
                              description: "Referral code copied to clipboard",
                              duration: 2000,
                            });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm text-muted-foreground">Referral Link:</p>
                        <div className="flex items-center space-x-2">
                          <Input
                            readOnly
                            value={referralLink}
                            className="font-mono text-xs"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(referralLink);
                              toast({
                                title: "Success!",
                                description: "Referral link copied to clipboard",
                                duration: 2000,
                              });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <span className="text-sm font-medium text-green-600 animate-pulse">
                  {profile.referredByCode && !profile.hasQualifyingPurchase
                    ? "Complete a purchase over $100 to earn your referral bonus!"
                    : "Earn 250 points when you refer a friend!"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4 w-full">
          <TabsTrigger value="stats" className="text-lg">Statistics</TabsTrigger>
          <TabsTrigger value="points" className="text-lg">Points History</TabsTrigger>
          <TabsTrigger value="badges" className="text-lg">Badges</TabsTrigger>
          <TabsTrigger value="rewards" className="text-lg">Rewards</TabsTrigger>
        </TabsList>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <motion.div variants={cardVariants}>
            <SustainabilityImpact 
              impactMetrics={impactMetrics}
              onImpactCardClick={handleImpactCardClick}
              cardVariants={cardVariants}
            />
          </motion.div>
        </TabsContent>

        {/* Points History Tab */}
        <TabsContent value="points">
          <motion.div variants={cardVariants}>
            <PointsHistory />
          </motion.div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  Badges & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges && badges.length > 0 ? (
                    badges.map((badge) => (
                      <motion.div
                        key={badge.badgeId}
                        className="relative p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-2">
                            {badge.category === 'SUSTAINABILITY' && (
                              <TreeDeciduous className="h-8 w-8 text-green-500" />
                            )}
                            {badge.category === 'LEADERBOARD' && (
                              <LeaderboardIcon className="h-8 w-8 text-yellow-500" />
                            )}
                            {badge.category === 'QUALITY_ENGAGEMENT' && (
                              <Star className="h-8 w-8 text-blue-500" />
                            )}
                            {badge.category === 'QUALITY_SERVICE' && (
                              <Star className="h-8 w-8 text-purple-500" />
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
                          <p className="text-xs text-gray-600">{badge.subtitle}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(badge.earnedOn).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500">
                      No badges earned yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Redeem Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Add reward cards here */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Gift className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="font-bold mb-2">$5 Store Credit</h3>
                        <p className="text-sm text-gray-600 mb-4">Redeem 500 points for store credit</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                          Redeem 500 points
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Add more reward cards as needed */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

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
    </motion.div>
  );
};