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

  const renderRankIcon = (rank: number) => {
    switch (true) {
      case rank === 1:
        return <Trophy className="text-yellow-500" sx={{ fontSize: 28 }} />;
      case rank <= 3:
        return <Medal className="text-gray-400" sx={{ fontSize: 24 }} />;
      case rank <= 10:
        return <Star className="text-amber-500" sx={{ fontSize: 24 }} />;
      default:
        return <Star className="text-gray-600" sx={{ fontSize: 20 }} />;
    }
  };

  const shareToSocialMedia = (platform: 'linkedin' | 'facebook' | 'instagram') => {
    const impactMessage = `I've prevented ${impactMetrics?.weightSaved.toFixed(2)}kg of food waste and saved ${impactMetrics?.co2Prevented.toFixed(2)}kg of CO₂ emissions through sustainable shopping!`;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(impactMessage)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(impactMessage)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        toast({
          title: "Instagram Sharing",
          description: "Screenshot your impact metrics to share on Instagram!",
          duration: 3000,
        });
        break;
    }
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
                  <div className="flex items-center gap-2 mt-2">
                    {renderRankIcon(3)}
                    <span className="text-gray-600">Rank #3</span>
                  </div>
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
            {/* Impact Summary Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreeDeciduous className="h-5 w-5" />
                  Your Sustainability Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-lg text-gray-700 mb-6">
                  <p className="leading-relaxed">
                    Your sustainable choices have prevented{' '}
                    <span className="font-bold text-green-600">
                      {(impactMetrics?.weightSaved ?? 0).toFixed(2)} kg
                    </span> of food waste
                    and saved{' '}
                    <span className="font-bold text-green-600">
                      {(impactMetrics?.co2Prevented ?? 0).toFixed(2)} kg
                    </span> of CO₂ emissions!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Recycle className="h-8 w-8" />,
                      value: (impactMetrics?.weightSaved ?? 0).toFixed(1),
                      suffix: "kg",
                      label: "Food Saved",
                      color: "green",
                      bgColor: "bg-green-50"
                    },
                    {
                      icon: <Battery className="h-8 w-8" />,
                      value: (impactMetrics?.co2Prevented ?? 0).toFixed(1),
                      suffix: "kg",
                      label: "CO₂ Prevented",
                      color: "yellow",
                      bgColor: "bg-yellow-50"
                    },
                    {
                      icon: <Droplets className="h-8 w-8" />,
                      value: (impactMetrics?.electricityDaysSaved ?? 0).toFixed(1),
                      suffix: "days",
                      label: "Electricity Days Saved",
                      color: "blue",
                      bgColor: "bg-blue-50"
                    },
                    {
                      icon: <TreeDeciduous className="h-8 w-8" />,
                      value: (impactMetrics?.treesEquivalent ?? 0).toFixed(1),
                      suffix: "",
                      label: "Trees Equivalent",
                      color: "emerald",
                      bgColor: "bg-emerald-50"
                    }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden"
                    >
                      <Card className={`border-none ${metric.bgColor}`}>
                        <CardContent className="pt-6">
                          <motion.div
                            className="flex items-center justify-center flex-col relative z-10"
                            whileHover={{ y: -5 }}
                          >
                            <div className={`text-${metric.color}-500 mb-2`}>
                              {metric.icon}
                            </div>
                            <p className={`text-2xl font-bold text-${metric.color}-600`}>
                              {metric.value}{metric.suffix}
                            </p>
                            <p className="text-sm text-gray-600">{metric.label}</p>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocialMedia('linkedin')}
                    className="flex items-center gap-2"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                    Share on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocialMedia('facebook')}
                    className="flex items-center gap-2"
                  >
                    <FacebookIcon className="h-4 w-4" />
                    Share on Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocialMedia('instagram')}
                    className="flex items-center gap-2"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Share on Instagram
                  </Button>
                </div>
              </CardContent>
            </Card>
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
    </motion.div>
  );
};