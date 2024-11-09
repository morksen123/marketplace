import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Medal, Trophy, Star, TreeDeciduous, Droplets, Battery, Recycle, Info, TrendingUp, Heart, Package, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LinearProgress, Box, Typography } from '@mui/material';
import { DistributorInformation } from './components/DistributorInformation';
import { Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  distributorName: string;
  points: number;
  wasteReduced: number;
  rank: number;
  carbonSaved: number;
  waterSaved: number;
  energySaved: number;
  treesPlanted: number;
  sustainabilityStreak: number;
  lastActive: string;
  referralCount: number;
  weightOfFoodSaved: number;
  profilePic: string;
  email: string;
}

interface DistributorDTO {
  id: number;
  email: string;
  points: number;
  distributorName: string;
}

export const DistributorLeaderboard = () => {
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [daysUntilReset, setDaysUntilReset] = useState<number>(0);
  const [currentDistributor, setCurrentDistributor] = useState<DistributorDTO | null>(null);

  const calculateDaysUntilReset = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = Math.abs(lastDay.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    setDaysUntilReset(calculateDaysUntilReset());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leaderboardResponse, profileResponse] = await Promise.all([
          fetch('/api/distributor/leaderboard', {
            credentials: 'include'
          }),
          fetch('/api/distributor/profile', {
            credentials: 'include'
          })
        ]);

        if (!leaderboardResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const leaderboardData = await leaderboardResponse.json();
        const profileData = await profileResponse.json();

        setUsers(leaderboardData);
        setCurrentDistributor(profileData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Split users into top 3 and next 10 users (total of 13)
  const topThree = users.slice(0, 3);
  const nextTen = users.slice(3, 13);
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
    hidden: { y: 20, opacity: 0, rotateX: -50 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const renderMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={28} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-700" size={24} />;
      default:
        return <Star className="text-gray-600" size={20} />;
    }
  };

  const getGradientByRank = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100";
      case 2:
        return "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100";
      case 3:
        return "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-100";
      default:
        return "bg-gradient-to-br from-white to-gray-50";
    }
  };

  // Add this with the other animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Add community impact stats
  const communityStats = {
    totalWasteReduced: users.reduce((acc, user) => acc + user.wasteReduced, 0),
    totalCarbonSaved: users.reduce((acc, user) => acc + user.carbonSaved, 0),
    totalWaterSaved: users.reduce((acc, user) => acc + user.waterSaved, 0),
    totalTreesPlanted: users.reduce((acc, user) => acc + user.treesPlanted, 0),
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const getOrdinalSuffix = (i: number) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const getLeaderboardMessage = () => {
    if (!currentDistributor || !users.length) return null;

    // Find current distributor's position in the leaderboard
    const distributorPosition = users.findIndex(user => user.email === currentDistributor.email);

    // If distributor is not in top 10
    if (distributorPosition === -1) {
      const pointsNeeded = users[users.length - 1].points - currentDistributor.points;
      if (pointsNeeded <= 0) {
        return {
          message: "Keep earning points to climb up the leaderboard!",
          type: 'info'
        };
      }
      return {
        message: `You need ${pointsNeeded.toLocaleString()} more points to appear on the leaderboard!`,
        type: 'info'
      };
    }

    // If distributor is in top 10 but not first
    if (distributorPosition > 0) {
      const pointsNeeded = users[distributorPosition - 1].points - currentDistributor.points;
      const nextUser = users[distributorPosition - 1];
      return {
        message: `You're in ${distributorPosition + 1}${getOrdinalSuffix(distributorPosition + 1)} place! ${pointsNeeded.toLocaleString()} more points to overtake ${nextUser.distributorName}!`,
        type: 'success'
      };
    }

    // If distributor is first
    return {
      message: "You're leading the leaderboard! Keep up the great work!",
      type: 'success'
    };
  };

  // Add loading and error states to the return
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="w-full py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex items-center justify-center gap-3"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Calendar className="h-5 w-5 text-green-400" />
            <p className="text-center text-sm">
              <span className="text-gray-800 mr-2">Monthly leaderboard resets in</span>
              <span className="font-bold bg-green-500 bg-clip-text text-transparent">
                {daysUntilReset} {daysUntilReset === 1 ? 'day' : 'days'}
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Full-width Status Message */}
      {getLeaderboardMessage() && (
        <motion.div className="w-full">
          <Alert
            variant={getLeaderboardMessage()?.type === 'success' ? 'success' : 'info'}
            className="border-none shadow-lg bg-gradient-to-r from-green-400/90 to-blue-500/90 backdrop-blur-sm text-white py-6"
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-3 w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <AlertDescription className="flex flex-col items-center gap-3 text-center">
                <span className="text-xl font-medium">
                  {getLeaderboardMessage()?.message.split('!')[0]}!
                </span>
                {getLeaderboardMessage()?.message.includes('overtake') && (
                  <motion.div
                    className="bg-white/20 px-6 py-2 rounded-full"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(255,255,255,0.4)",
                        "0 0 0 10px rgba(255,255,255,0)",
                        "0 0 0 0 rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-lg font-bold">
                      {getLeaderboardMessage()?.message.split('!')[1]}
                    </span>
                  </motion.div>
                )}
              </AlertDescription>
            </motion.div>
          </Alert>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="w-full bg-white rounded-t-[2.5rem] min-h-screen">
        <div className="max-w-7xl mx-auto px-2 py-12">
          {/* Transaction Fee Tiers Bar */}
          {currentDistributor && (
            <div className="mb-6">
              <div className="flex flex-col mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Transaction Fee Tier</h3>
                <p className="text-sm text-gray-600">
                  The standard transaction fee is 10%. Maintain your position on the leaderboard at month-end to qualify for reduced fees.
                </p>
              </div>
             
              <div className="grid grid-cols-3 gap-3">
                {/* Top 3 Tier */}
                <div
                  className={`
                    rounded-lg p-3 transition-all duration-200 relative
                    ${users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 3
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50'
                    }
                  `}
                >
                  {users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 3 && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                      Current
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">Top 3</p>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">5%</p>
                    </div>
                  </div>
                </div>

                {/* Top 5 Tier */}
                <div
                  className={`
                    rounded-lg p-3 transition-all duration-200 relative
                    ${users.findIndex(u => u.distributorId === currentDistributor.distributorId) >= 3 && users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 5
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50'
                    }
                  `}
                >
                  {users.findIndex(u => u.distributorId === currentDistributor.distributorId) >= 3 && users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 5 && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                      Current
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">Top 5</p>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">6%</p>
                    </div>
                  </div>
                </div>

                {/* Top 10 Tier */}
                <div
                  className={`
                    rounded-lg p-3 transition-all duration-200 relative
                    ${users.findIndex(u => u.distributorId === currentDistributor.distributorId) >= 5 && users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 10
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50'
                    }
                  `}
                >
                  {users.findIndex(u => u.distributorId === currentDistributor.distributorId) >= 5 && users.findIndex(u => u.distributorId === currentDistributor.distributorId) < 10 && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                      Current
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">Top 10</p>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">7%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard Section - Left Side */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-lg border-none">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Top Distributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Top 3 Podium */}
                  <div className="pt-16 pb-0 px-8">
                    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                      {/* Second Place */}
                      <div className="flex flex-col items-center">
                        <p className="text-black font-bold text-xl mb-1">{topThree[1]?.distributorName}</p>
                        <motion.div
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white mb-8"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={topThree[1]?.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                            onClick={() => handleUserClick(topThree[1])}
                          />
                        </motion.div>
                        <div className="relative w-full">
                          <p className="text-black text-l font-bold mb-2">{topThree[1]?.points?.toLocaleString() || 0} points</p>
                          <p className="text-black/80 text-sm mb-2">Food Saved: {topThree[1]?.weightOfFoodSaved || 0} kg</p>
                          <p className="text-black/80 text-sm mb-4">Weight Donated: {topThree[1]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-16 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">2</span>
                          </div>
                        </div>
                      </div>

                      {/* First Place */}
                      <div className="flex flex-col items-center -mt-8">
                        <p className="text-black font-bold text-xl mb-1">{topThree[0]?.distributorName}</p>
                        <motion.div
                          className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white mb-8"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={topThree[0]?.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                            onClick={() => handleUserClick(topThree[0])}
                          />
                        </motion.div>
                        <div className="relative w-full">
                          <p className="text-black text-l font-bold mb-2">{topThree[0]?.points?.toLocaleString() || 0} points</p>
                          <p className="text-black/80 text-sm mb-2">Food Saved: {topThree[0]?.weightOfFoodSaved || 0} kg</p>
                          <p className="text-black/80 text-sm mb-4">Weight Donated: {topThree[0]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-20 rounded-t-lg flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">1</span>
                          </div>
                        </div>
                      </div>

                      {/* Third Place */}
                      <div className="flex flex-col items-center">
                        <p className="text-black font-bold text-xl mb-1">{topThree[2]?.distributorName}</p>
                        <motion.div
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white mb-8"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={topThree[2]?.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                            onClick={() => handleUserClick(topThree[2])}
                          />
                        </motion.div>
                        <div className="relative w-full">
                          <p className="text-black text-l font-bold mb-2">{topThree[2]?.points?.toLocaleString() || 0} points</p>
                          <p className="text-black/80 text-sm mb-2">Food Saved: {topThree[2]?.weightOfFoodSaved || 0} kg</p>
                          <p className="text-black/80 text-sm mb-4">Weight Donated: {topThree[2]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-14 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="px-6 py-8">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Rank</TableHead>
                          <TableHead>Distributor</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                          <TableHead className="text-right">Food Saved</TableHead>
                          <TableHead className="text-right">Weight Donated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nextTen.map((user, index) => (
                          <motion.tr
                            key={user.distributorId}
                            variants={tableRowVariants}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleUserClick(user)}
                            onMouseEnter={() => setHoveredUser(user.distributorId)}
                            onMouseLeave={() => setHoveredUser(null)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {index + 4}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                  <img
                                    src={user.profilePic}
                                    alt={user.distributorName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{user.distributorName}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {user.points.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {(user.weightOfFoodSaved || 0).toLocaleString()}kg
                            </TableCell>
                            <TableCell className="text-right text-red-500">
                              CHANGE
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section - Right Side */}
            <div className="lg:col-span-1 space-y-8">
              {/* Personal Stats Card */}
              <Card className="shadow-lg border-none">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Your Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-7xl mx-auto mb-6 px-4">
                    <p className="text-center text-sm">
                      <span className="text-gray-800 mr-2">
                        Keep climbing the leaderboard! Earn badges to unlock bonus points and rewards.
                      </span>
                    </p>
                  </div>
                  {currentDistributor ? (
                    <div className="space-y-6">
                      {/* Profile Summary */}
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                            <img
                              src={users.find(u => u.distributorId === currentDistributor.distributorId)?.profilePic || 'default-avatar.png'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-[#4263EB] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {users.findIndex(u => u.distributorId === currentDistributor.distributorId) === -1
                              ? 'N/A'
                              : `${users.findIndex(u => u.distributorId === currentDistributor.distributorId) + 1}${getOrdinalSuffix(users.findIndex(u => u.distributorId === currentDistributor.distributorId) + 1)}`}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{currentDistributor.distributorName}</h3>
                        <p className="text-gray-600">{currentDistributor.points?.toLocaleString() || 0} points</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <h4 className="text-gray-600 text-sm">Food Saved</h4>
                          <p className="text-xl font-bold text-green-600">
                            {users.find(u => u.distributorId === currentDistributor.distributorId)?.weightOfFoodSaved?.toLocaleString() ?? 0} kg
                          </p>
                        </div>
                        {/* <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <h4 className="text-gray-600 text-sm">Referrals</h4>
                          <p className="text-xl font-bold text-blue-600">
                            {users.find(u => u.distributorId === currentUser.distributorId)?.weightDonated || 0}
                          </p>
                        </div> */}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Please log in to view your statistics
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Section */}
              {/* Product Listing Alert */}
              <Alert
                variant="default"
                className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-100 text-black py-5"
              >
                <motion.div
                  className="flex flex-col items-center gap-3 w-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertDescription className="flex flex-col items-center gap-3">
                    <span className="text-xl font-medium">List Your Products</span>
                    <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                      <Package className="h-5 w-5" />
                      <span className="font-bold">Create new product listings</span>
                    </div>
                    <Link
                      to="/create-product-listing"
                      className="mt-1 bg-white text-teal-600 hover:bg-emerald-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Create Listing →
                    </Link>
                  </AlertDescription>
                </motion.div>
              </Alert>

              {/* Promotions Alert */}
              <Alert
                variant="default"
                className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 text-black py-5"
              >
                <motion.div
                  className="flex flex-col items-center gap-3 w-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertDescription className="flex flex-col items-center gap-3">
                    <span className="text-xl font-medium">Create Special Promotions</span>
                    <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                      <Tag className="h-5 w-5" />
                      <span className="font-bold">Boost your sales with promotions</span>
                    </div>
                    <Link
                      to="/distributor/promotions"
                      className="mt-1 bg-white text-purple-600 hover:bg-purple-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Create Promotion →
                    </Link>
                  </AlertDescription>
                </motion.div>
              </Alert>

              {/* Donations Alert */}
              <Alert
                variant="default"
                className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 text-black py-5"
              >
                <motion.div
                  className="flex flex-col items-center gap-3 w-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertDescription className="flex flex-col items-center gap-3">
                    <span className="text-xl font-medium">
                      Make a Difference Through Donations
                    </span>
                    <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                      <Heart className="h-5 w-5" />
                      <span className="font-bold">Help reduce food waste today</span>
                    </div>
                    <Link
                      to="/distributor/donations"
                      className="mt-1 bg-white text-indigo-600 hover:bg-blue-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Start Donating →
                    </Link>
                  </AlertDescription>
                </motion.div>
              </Alert>

            </div>
          </div>
        </div>
      </div>

      <DistributorInformation
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </motion.div>
  );
};
