import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@mui/icons-material';
import { DistributorPointsHistory } from './components/DistributorPointsHistoryTable';

interface Profile {
  points: number;
  distributorName: string;
}

interface Badge {
  badgeId: number;
  title: string;
  subtitle: string;
  criteria: string;
  earnedOn: string;
  category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
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
  });
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      console.log(data);
      setProfile(data);
    };
    getProfile();

    const getBadges = async () => {
      const badgeData = await fetchBadges();
      setBadges(badgeData);
    };
    getBadges();
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

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header */}
      <motion.div variants={cardVariants} className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{profile.distributorName}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {renderRankIcon(3)}
                <span className="text-gray-600">Rank #3</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div>
                <div className="text-4xl font-bold text-green-600">{profile.points}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>


      {/* Add Points History section */}
      <motion.div variants={cardVariants} className="mt-8 mb-8">
        <DistributorPointsHistory />
      </motion.div>

      {/* Impact Stats */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="flex items-center justify-center flex-col"
              whileHover={{ scale: 1.05 }}
            >
              <Recycle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-600">125kg</p>
              <p className="text-sm text-gray-600">Waste Reduced</p>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="flex items-center justify-center flex-col"
              whileHover={{ scale: 1.05 }}
            >
              <Battery className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-yellow-600">500kg</p>
              <p className="text-sm text-gray-600">Carbon Saved</p>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="flex items-center justify-center flex-col"
              whileHover={{ scale: 1.05 }}
            >
              <Droplets className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-600">1000L</p>
              <p className="text-sm text-gray-600">Water Saved</p>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="flex items-center justify-center flex-col"
              whileHover={{ scale: 1.05 }}
            >
              <TreeDeciduous className="h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-emerald-600">5</p>
              <p className="text-sm text-gray-600">Trees Planted</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges & Achievements */}
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
    </motion.div>
  );
};