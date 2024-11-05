import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreeDeciduous, Droplets, Battery, Recycle, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Badge {
    badgeId: number;
    title: string;
    subtitle: string;
    criteria: string;
    earnedOn: string;
    category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
}

interface User {
    distributorId: number;
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
    badges?: Badge[];
}

interface DistributorInformationProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DistributorInformation: React.FC<DistributorInformationProps> = ({
    user,
    isOpen,
    onClose,
}) => {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        const fetchBadges = async () => {
            if (user?.distributorId) {
                try {
                    const response = await fetch(`/api/distributor/${user.distributorId}/badges`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch badges');
                    }
                    const data = await response.json();
                    console.log("here", data);
                    setBadges(data);
                } catch (error) {
                    console.error('Error fetching badges:', error);
                }
            }
        };

        fetchBadges();

    }, [user?.distributorId]);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Member Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={user.profilePic}
                                alt={user.distributorName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.distributorName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-green-500">Rank #{user.rank}</Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    {user.points?.toLocaleString() || 0} Points
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Recycle className="h-8 w-8 text-green-500 mb-2" />
                                        <p className="text-2xl font-bold text-green-600">{user.wasteReduced}kg</p>
                                        <p className="text-sm text-gray-600">Waste Reduced</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Battery className="h-8 w-8 text-yellow-500 mb-2" />
                                        <p className="text-2xl font-bold text-yellow-600">{user.carbonSaved}kg</p>
                                        <p className="text-sm text-gray-600">Carbon Saved</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                                        <p className="text-2xl font-bold text-blue-600">{user.waterSaved}L</p>
                                        <p className="text-sm text-gray-600">Water Saved</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <TreeDeciduous className="h-8 w-8 text-emerald-500 mb-2" />
                                        <p className="text-2xl font-bold text-emerald-600">{user.treesPlanted}</p>
                                        <p className="text-sm text-gray-600">Trees Planted</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Activity Stats</h3>
                            <div className="space-y-2">
                                <p className="text-sm">Sustainability Streak: {user.sustainabilityStreak} days</p>
                                <p className="text-sm">Last Active: {new Date(user.lastActive).toLocaleDateString()}</p>
                                <p className="text-sm">Food Saved: {user?.weightOfFoodSaved?.toLocaleString() ?? 0}kg</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Community Impact</h3>
                            <div className="space-y-2">
                                <p className="text-sm">Referrals Made: {user.referralCount}</p>
                                <p className="text-sm">Energy Saved: {user.energySaved}kWh</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-4">Earned Badges</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                            <motion.div key={badge.badgeId} whileHover={{ scale: 1.05 }}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="mb-2">
                                                {badge.category === 'SUSTAINABILITY' && (
                                                    <TreeDeciduous className="h-8 w-8 text-green-500" />
                                                )}
                                                {badge.category === 'LEADERBOARD' && (
                                                    <Star className="h-8 w-8 text-yellow-500" />
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
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
