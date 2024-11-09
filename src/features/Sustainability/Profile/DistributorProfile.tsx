import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Share, ContentCopy as Copy } from '@mui/icons-material';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImpactExplanation } from './components/ImpactExplanation';
import { SustainabilityImpact } from './components/SustainabilityImpact';
import { Badges } from './components/Badges';
import { PointsGuide } from './components/PointsGuide';
import { DistributorPointsHistory } from './components/DistributorPointsHistoryTable';
import { RedeemBoosts } from './components/RedeemBoosts';

interface Profile {
  points: number;
  savedPoints: number;
  distributorName: string;
  email: string;
  createdDateTime: string;
  profilePic: string;
  contactName: string;
  contactNumber: string;
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
    const response = await fetch('/api/distributor/profile', {
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

const fetchBadges = async () => {
  try {
    const response = await fetch('/api/distributor/badges', {
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

export const DistributorProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    points: 0,
    distributorName: '',
    email: '',
    createdDateTime: '',
    profilePic: '',
    contactName: '',
    contactNumber: ''
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetricsDto | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<{
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null>(null);
  const [showPointsGuide, setShowPointsGuide] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, badgeData, impactData] = await Promise.all([
          fetchProfile(),
          fetchBadges(),
          fetch('/api/impact/distributor/personal', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }).then(res => res.json())
        ]);

        setProfile(profileData);
        setBadges(badgeData);
        setImpactMetrics(impactData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <motion.div className="mx-12 px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[auto,1.5fr,0.8fr,0.8fr] gap-5 mb-8">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={profile.profilePic || '/default-avatar.png'}
            alt={profile.distributorName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
          <CardContent className="p-8">
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <div className="text-4xl font-bold text-black">{profile.distributorName}</div>
                  <div className="text-xs text-gray-500 mt-2">Member since {new Date(profile.createdDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 relative">
          <div className="absolute top-2 left-2">
            <div className="group relative">
              <div className="rounded-full w-5 h-5 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-sm">?</span>
              </div>
              <div
                className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-md shadow-lg w-72"
              >
                These points reset every month. They contribute to your leaderboard position.
              </div>
            </div>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-green-500">{profile.points}</div>
              <div className="text-xl text-gray-600 mt-2">Leaderboard Points</div>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 underline absolute top-2 right-2"
                onClick={() => setShowPointsGuide(true)}
              >
                How to Earn?
              </button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPointsHistory(true)}
              className="w-48 mt-2"
            >
              View Points History
            </Button>
          </CardContent>
        </Card>

        {/* Saved Points Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 relative">
          <div className="absolute top-2 left-2">
            <div className="group relative">
              <div className="rounded-full w-5 h-5 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-sm">?</span>
              </div>
              <div
                className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-md shadow-lg w-72"
              >
                After the Leaderboard resets, these points are added to your Redeemable Points and can be redeemed for boosts.
              </div>
            </div>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold text-green-500">{profile.savedPoints}</div>
            <div className="text-xl text-gray-600 mt-2">Redeemable Points</div>
            <Button
              variant="outline"
              onClick={() => setShowBoosts(true)}
              className="w-48 mt-2"
            >
              View Rewards
            </Button>
          </CardContent>
        </Card>
      </div>


      {/* Bottom Section - Sustainability Impact and Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sustainability Impact */}
        <SustainabilityImpact
          impactMetrics={impactMetrics}
          onImpactCardClick={handleImpactCardClick}
          cardVariants={cardVariants}
        />

        {/* Badges */}
        <Badges badges={badges} 
          userType="distributor"
        />
      </div>

      {/* Dialogs */}
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

      <Dialog open={showPointsHistory} onOpenChange={setShowPointsHistory}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
          </DialogHeader>
          <DistributorPointsHistory />
        </DialogContent>
      </Dialog>

      <Dialog open={showBoosts} onOpenChange={setShowBoosts}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
          </DialogHeader>
          <RedeemBoosts />
        </DialogContent>
      </Dialog>
      <PointsGuide
        isOpen={showPointsGuide}
        onClose={() => setShowPointsGuide(false)}
        userType="distributor"
      />
    </motion.div>
  );
};