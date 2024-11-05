import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Medal, Trophy, Star, TreeDeciduous, Droplets, Battery, Recycle, Info, TrendingUp } from 'lucide-react';
import { motion  } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LinearProgress, Box, Typography } from '@mui/material';
import { BuyerInformation } from './components/BuyerInformation';

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

export const Leaderboard = () => {
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/buyer/leaderboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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

  // Add this section before the leaderboard
  const CommunityImpactSection = () => (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Our Community Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="flex items-center justify-center flex-col"
              whileHover={{ scale: 1.05 }}
            >
              <Recycle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-600">{communityStats.totalWasteReduced}kg</p>
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
              <p className="text-2xl font-bold text-yellow-600">{communityStats.totalCarbonSaved}kg</p>
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
              <p className="text-2xl font-bold text-blue-600">{communityStats.totalWaterSaved}L</p>
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
              <p className="text-2xl font-bold text-emerald-600">{communityStats.totalTreesPlanted}</p>
              <p className="text-sm text-gray-600">Trees Planted</p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  // Add this section after the leaderboard
  const SustainabilityTipsSection = () => (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sustainability Tips & Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly Challenge</TabsTrigger>
              <TabsTrigger value="tips">Daily Tips</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <div className="space-y-4">
                <h3 className="font-semibold">Current Challenge: Reduce Plastic Usage</h3>
                
                {/* MUI Progress Bar */}
                <Box sx={{ width: '100%', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={65} 
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#22c55e', // green-500
                            borderRadius: 5,
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        65%
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <p className="text-sm text-gray-600">Community Progress</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Join Challenge
                  </Button>
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tips">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Use reusable bags for grocery shopping
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Turn off lights when leaving a room
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Use a reusable water bottle
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="achievements">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Add achievement badges here */}
                <motion.div 
                  className="text-center p-4 rounded-lg border"
                  whileHover={{ scale: 1.05 }}
                >
                  <TreeDeciduous className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="font-semibold">Tree Hugger</p>
                  <p className="text-xs text-gray-600">Plant 5 trees</p>
                </motion.div>
                {/* Add more achievements */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );

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
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top 3 Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
      >
        {[topThree[1], topThree[0], topThree[2]].map((user, index) => (
          <motion.div
            key={user.id}
            variants={cardVariants}
            className={`${index === 1 ? 'md:mt-0' : 'md:mt-12'}`}
          >
            <Card className={`relative overflow-hidden ${getGradientByRank(user.rank)} hover:shadow-xl transition-all duration-300`} onClick={() => handleUserClick(user)} cursor-pointer>
              <CardContent className="text-center pt-6">
                {/* Profile Picture */}
                <motion.div 
                  className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={user.profilePic} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <motion.h3 className="text-xl font-bold mb-2">
                  {user.name}
                </motion.h3>
                <div className="flex flex-col gap-4">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Badge className="text-lg px-4 py-2 bg-green-500 text-white block">
                      {user.points?.toLocaleString() || 0} Points
                    </Badge>
                  </motion.div>
                  {(user.weightOfFoodSaved || user.weightOfFoodSaved !== 0) && (
                    <motion.div whileHover={{ scale: 1.05 }} className="text-sm text-gray-600">
                      Food Saved: {user.weightOfFoodSaved.toLocaleString()} kg
                    </motion.div>
                  )}
                  {(user.referralCount || user.referralCount !== 0) && (
                    <motion.div whileHover={{ scale: 1.05 }} className="text-sm text-gray-600">
                      Referred: {user.referralCount}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Other Users Table */}
      <Card className="overflow-hidden shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Rank</TableHead>
                <TableHead className="text-left">Member</TableHead>
                <TableHead className="text-left">Points</TableHead>
                <TableHead className="text-left">Food Saved (kg)</TableHead>
                <TableHead className="text-left">Referred</TableHead>
                <TableHead className="text-left">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nextTen.map((user, index) => (
                <TableRow key={user.id} onClick={() => handleUserClick(user)} hover:bg-gray-100 cursor-pointer>
                  <TableCell className="text-left font-medium">
                    {index + 4}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={user.profilePic} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">{user.points.toLocaleString()}</TableCell>
                  <TableCell className="text-left">{user.weightOfFoodSaved.toLocaleString()}</TableCell>
                  <TableCell className="text-left">{user.referralCount}</TableCell>
                  <TableCell className="text-left">{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Community Impact Section */}
      <CommunityImpactSection />

      {/* Add Sustainability Tips Section */}
      <SustainabilityTipsSection />

      <BuyerInformation 
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </motion.div>
  );
};
