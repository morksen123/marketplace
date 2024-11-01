import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Medal, Sparkles, Trophy, Leaf, Star, BarChart, TreeDeciduous, Droplets, Battery, Recycle, Info, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LinearProgress, Box, Typography } from '@mui/material';

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
}

export const Leaderboard = () => {
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);

  // Sample data - replace with your actual data source
  const users: User[] = [
    { id: 1, name: "John Doe", points: 1500, wasteReduced: 250, rank: 1, carbonSaved: 100, waterSaved: 50, energySaved: 75, treesPlanted: 5, sustainabilityStreak: 7, lastActive: "2023-01-01" },
    { id: 2, name: "Jane Smith", points: 1200, wasteReduced: 200, rank: 2, carbonSaved: 90, waterSaved: 45, energySaved: 70, treesPlanted: 4, sustainabilityStreak: 6, lastActive: "2023-01-02" },
    { id: 3, name: "Bob Johnson", points: 1000, wasteReduced: 180, rank: 3, carbonSaved: 80, waterSaved: 40, energySaved: 65, treesPlanted: 3, sustainabilityStreak: 5, lastActive: "2023-01-03" },
    { id: 4, name: "Alice Brown", points: 800, wasteReduced: 150, rank: 4, carbonSaved: 70, waterSaved: 35, energySaved: 60, treesPlanted: 2, sustainabilityStreak: 4, lastActive: "2023-01-04" },
    { id: 5, name: "Charlie Wilson", points: 750, wasteReduced: 140, rank: 5, carbonSaved: 65, waterSaved: 30, energySaved: 55, treesPlanted: 1, sustainabilityStreak: 3, lastActive: "2023-01-05" },
    { id: 6, name: "Eva Martinez", points: 700, wasteReduced: 130, rank: 6, carbonSaved: 60, waterSaved: 25, energySaved: 50, treesPlanted: 0, sustainabilityStreak: 2, lastActive: "2023-01-06" },
    { id: 7, name: "David Lee", points: 650, wasteReduced: 120, rank: 7, carbonSaved: 55, waterSaved: 20, energySaved: 45, treesPlanted: 0, sustainabilityStreak: 1, lastActive: "2023-01-07" },
    { id: 8, name: "Sarah Taylor", points: 600, wasteReduced: 110, rank: 8, carbonSaved: 50, waterSaved: 15, energySaved: 40, treesPlanted: 0, sustainabilityStreak: 0, lastActive: "2023-01-08" },
  ];

  // Split users into top 3 and others
  const topThree = users.slice(0, 3);
  const otherUsers = users.slice(3);

  const shootConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
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

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌍 Sustainability Champions 🌱
        </motion.h1>
        <p className="text-gray-600">Making the world greener, one step at a time</p>
      </motion.div>

      {/* Top 3 Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
      >
        {/* Reorder the top three into 2-1-3 layout */}
        {[topThree[1], topThree[0], topThree[2]].map((user, index) => {
          // Calculate visual order for animations
          const visualOrder = index === 1 ? 0 : index === 0 ? 1 : 2;
          
          return (
            <motion.div
              key={user.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
              onHoverStart={() => {
                setHoveredUser(user.id);
                if (user.rank === 1) shootConfetti();
              }}
              onHoverEnd={() => setHoveredUser(null)}
              className={`${index === 1 ? 'md:mt-0' : 'md:mt-12'}`} // Add margin to side pedestals
            >
              <Card className={`relative overflow-hidden ${getGradientByRank(user.rank)} hover:shadow-xl transition-all duration-300`}>
                <motion.div 
                  className="absolute top-0 right-0 p-2"
                  animate={floatingAnimation}
                >
                  {renderMedalIcon(user.rank)}
                  {user.rank === 1 && hoveredUser === user.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-0 right-0 left-0 bottom-0"
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.2, 0.8],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        >
                          <Sparkles className="text-yellow-400 absolute" size={16} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
                <CardHeader className="text-center">
                  <CardTitle className={`text-3xl font-bold ${index === 1 ? 'text-4xl' : ''}`}>#{user.rank}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <motion.h3 
                    className={`font-semibold mb-4 ${index === 1 ? 'text-2xl' : 'text-xl'}`}
                    animate={hoveredUser === user.id ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {user.name}
                  </motion.h3>
                  <motion.div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Badge className={`
                        bg-green-500 text-white hover:bg-green-600 
                        transition-colors duration-300 
                        ${index === 1 ? 'text-xl px-6 py-2' : 'text-lg px-4 py-1'}
                      `}>
                        {user.points} Points
                      </Badge>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-center gap-2 text-sm text-gray-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Leaf className="text-green-500" size={16} />
                      <span>{user.wasteReduced}kg waste reduced</span>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Other Users Table */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Other Environmental Heroes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(0,0,0,0.02)",
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Star className="text-gray-400" size={16} />
                        #{user.rank}
                      </motion.div>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Badge 
                          variant="secondary"
                          className="transition-all duration-300 hover:bg-green-100"
                        >
                          {user.points} Points
                        </Badge>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Leaf className="text-green-500" size={16} />
                        {user.wasteReduced}kg
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Community Impact Section */}
      <CommunityImpactSection />

      {/* Add Sustainability Tips Section */}
      <SustainabilityTipsSection />
    </motion.div>
  );
};
