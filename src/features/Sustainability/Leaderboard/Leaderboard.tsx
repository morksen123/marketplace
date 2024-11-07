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

      <BuyerInformation 
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </motion.div>
  );
};
