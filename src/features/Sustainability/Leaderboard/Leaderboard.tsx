import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medal, Trophy, Star, ShoppingCart, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { BuyerInformation } from './components/BuyerInformation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/Cart/hooks/useCart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
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
}

interface BuyerDTO {
  id: number;
  email: string;
  points: number;
  firstName: string;
  lastName: string;
}

export const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<BuyerDTO | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const { cart } = useCart();
  const [daysUntilReset, setDaysUntilReset] = useState<number>(0);
  const [referralPoints, setReferralPoints] = useState<number>(0);
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
        const [leaderboardResponse, profileResponse, pointsAllocationResponse] = await Promise.all([
          fetch('/api/buyer/leaderboard', {
            credentials: 'include'
          }),
          fetch('/api/buyer/profile', {
            credentials: 'include'
          }),
          fetch('/api/points-allocation', {
            credentials: 'include'
          })
        ]);

        if (!leaderboardResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const leaderboardData = await leaderboardResponse.json();
        const profileData = await profileResponse.json();
        const pointsAllocationData = await pointsAllocationResponse.json();
        setReferralPoints(pointsAllocationData.referralPoints);
        setUsers(leaderboardData);
        setCurrentUser(profileData)
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
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
        setReferralLink(data.referralLink);
      } catch (error) {
        console.error('Error fetching referral link:', error);
        throw error;
      }
    };
    fetchData();
    fetchReferralLink();
  }, []);

  const getOrdinalSuffix = (i: number) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const getLeaderboardMessage = () => {
    if (!currentUser || !users.length) return null;

    // Find current user's position in the leaderboard
    const userPosition = users.findIndex(user => user.email === currentUser.email);

    // If user is not in top 10
    if (userPosition === -1) {
      const pointsNeeded = users[users.length - 1].points - currentUser.points;
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

    // If user is in top 10 but not first
    if (userPosition > 0) {
      const pointsNeeded = users[userPosition - 1].points - currentUser.points;
      const nextUser = users[userPosition - 1];
      return {
        message: `You're in ${userPosition + 1}${getOrdinalSuffix(userPosition + 1)} place! ${pointsNeeded.toLocaleString()} more points to overtake ${nextUser.name}!`,
        type: 'success'
      };
    }

    // If user is first
    return {
      message: "You're leading the leaderboard! Continue purchasing to maintain your position!",
      type: 'success'
    };
  };

  // Split users into top 3 and next 10 users (total of 13)
  const topThree = users.slice(0, 3);
  const nextTen = users.slice(3, 10);
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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard Section - Left Side */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-lg border-none">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Top Players
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Top 3 Podium */}
                  <div className="pt-16 pb-0 px-8">
                    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                      {/* 2nd Place */}
                      <div className="flex flex-col items-center">
                        <p className="text-black font-bold text-xl mb-1">{topThree[1]?.name}</p>
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
                          <p className="text-black/80 text-sm mb-4">Referrals Made: {topThree[1]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-16 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">2</span>
                          </div>
                        </div>
                      </div>

                      {/* 1st Place */}
                      <div className="flex flex-col items-center -mt-8">
                        <p className="text-black font-bold text-xl mb-1">{topThree[0]?.name}</p>
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
                          <p className="text-black/80 text-sm mb-4">Referrals Made: {topThree[0]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-20 rounded-t-lg flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">1</span>
                          </div>
                        </div>
                      </div>

                      {/* 3rd Place */}
                      <div className="flex flex-col items-center">
                        <p className="text-black font-bold text-xl mb-1">{topThree[2]?.name}</p>

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
                          <p className="text-black text-l font-bold mb-2 mt-1">{topThree[2]?.points?.toLocaleString() || 0} points</p>
                          <p className="text-black/80 text-sm mb-2">Food Saved: {topThree[2]?.weightOfFoodSaved || 0} kg</p>
                          <p className="text-black/80 text-sm mb-4">Referrals Made: {topThree[2]?.referralCount || 0}</p>
                          <div className="absolute inset-x-0 bottom-0 h-15 bg-[#3651C0]/20 rounded-t-lg" />
                          <div className="relative z-10 bg-gradient-to-r from-green-400/90 to-blue-500/90 w-full h-14 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Food Saved</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Referrals</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nextTen.map((user, index) => (
                        <TableRow
                          key={user.id}
                          onClick={() => handleUserClick(user)}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{index + 4}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {user.points.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {user.weightOfFoodSaved.toLocaleString()}kg
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {user.referralCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                        <span className="text-gray-800 mr-2">Keep climbing the leaderboard! Earn badges to unlock bonus points and rewards.</span>
                      </p>
                  </div>
                  {currentUser ? (
                    <div className="space-y-6">
                      {/* Profile Summary */}
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                            <img
                              src={users.find(u => u.buyerId === currentUser.buyerId)?.profilePic || 'default-avatar.png'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-[#4263EB] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {users.findIndex(u => u.buyerId === currentUser.buyerId) === -1
                              ? 'N/A'
                              : `${users.findIndex(u => u.buyerId === currentUser.buyerId) + 1}${getOrdinalSuffix(users.findIndex(u => u.buyerId === currentUser.buyerId) + 1)}`}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{currentUser.firstName} {currentUser.lastName}</h3>
                        <p className="text-gray-600">{currentUser.points.toLocaleString()} points</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <h4 className="text-gray-600 text-sm">Food Saved</h4>
                          <p className="text-xl font-bold text-green-600">
                            {users.find(u => u.buyerId === currentUser.buyerId)?.weightOfFoodSaved.toLocaleString()} kg
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <h4 className="text-gray-600 text-sm">Referrals</h4>
                          <p className="text-xl font-bold text-blue-600">
                            {users.find(u => u.buyerId === currentUser.buyerId)?.referralCount || 0}
                          </p>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Please log in to view your statistics
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cart Alert */}
              {cart?.cartLineItems.length > 0 && (
                <Alert
                  variant="default"
                  className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 text-black py-6"
                >
                  <motion.div
                    className="flex flex-col items-center justify-center gap-3 w-full h-full"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <AlertDescription className="flex flex-col items-center gap-3">
                      <span className="text-xl font-medium">
                        Complete your cart checkout to earn points!
                      </span>
                      <div className="flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-bold">
                          {cart?.cartLineItems.reduce((total, item) => total + item.quantity, 0)} {cart?.cartLineItems.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'items'} in cart
                        </span>
                      </div>
                      <Link
                        to="/buyer/cart"
                        className="mt-2 bg-white text-indigo-500 hover:bg-purple-50 font-bold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Checkout Now →
                      </Link>
                    </AlertDescription>
                  </motion.div>
                </Alert>
              )}

              {/* Referral Alert */}
              <Alert
                variant="default"
                className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-100 text-black py-6"
              >
                <motion.div
                  className="flex flex-col items-center justify-center gap-3 w-full h-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertDescription className="flex flex-col items-center gap-3">
                    <span className="text-xl font-medium">
                      Refer friends & earn {referralPoints} points!
                    </span>
                    <div className="flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full">
                      <Users className="h-5 w-5" />
                      <span className="font-bold">
                        Share your referral code today
                      </span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="mt-2 bg-white text-teal-600 hover:bg-emerald-50 font-bold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                          Get Referral Code →
                        </button>
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
                              value={currentUser?.referralCode || ''}
                              className="font-mono"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(currentUser?.referralCode || '');
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
                  </AlertDescription>
                </motion.div>
              </Alert>
            </div>
          </div>
        </div>
      </div>

      {/* Keep existing modal */}
      <BuyerInformation
        user={selectedUser}
        currentUser={currentUser}   
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </motion.div>
  );
};
