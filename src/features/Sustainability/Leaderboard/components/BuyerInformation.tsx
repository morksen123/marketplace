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
    buyerId: number;
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
    badges?: Badge[];
}

interface BuyerInformationProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ImpactMetrics {
    weightSaved: number;
    co2Prevented: number;
    treesEquivalent: number;
    electricityDaysSaved: number;
}

export const BuyerInformation: React.FC<BuyerInformationProps> = ({
    user,
    isOpen,
    onClose,
}) => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.buyerId) {
                try {
                    const badgesResponse = await fetch(`/api/buyer/${user.buyerId}/badges`, {
                        credentials: 'include'
                    });
                    if (!badgesResponse.ok) {
                        throw new Error('Failed to fetch badges');
                    }
                    const badgesData = await badgesResponse.json();
                    setBadges(badgesData);

                    const impactResponse = await fetch(`/api/impact/buyer/${user.buyerId}`, {
                        credentials: 'include'
                    });
                    if (!impactResponse.ok) {
                        throw new Error('Failed to fetch impact metrics');
                    }
                    const impactData = await impactResponse.json();
                    setImpactMetrics(impactData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [user?.buyerId]);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
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
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Recycle className="h-8 w-8 text-green-500 mb-2" />
                                        <p className="text-2xl font-bold text-green-600">
                                            {impactMetrics?.weightSaved.toFixed(1)}kg
                                        </p>
                                        <p className="text-sm text-gray-600">Food Waste Prevented</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Battery className="h-8 w-8 text-yellow-500 mb-2" />
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {impactMetrics?.co2Prevented.toFixed(1)}kg
                                        </p>
                                        <p className="text-sm text-gray-600">CO₂ Prevented</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                                        <p className="text-2xl font-bold text-blue-600">
                                            {impactMetrics?.electricityDaysSaved.toFixed(1)} days
                                        </p>
                                        <p className="text-sm text-gray-600">Electricity Saved</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center">
                                        <TreeDeciduous className="h-8 w-8 text-emerald-500 mb-2" />
                                        <p className="text-2xl font-bold text-emerald-600">
                                            {impactMetrics?.treesEquivalent.toFixed(1)}
                                        </p>
                                        <p className="text-sm text-gray-600">Trees Equivalent</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Community Impact</h3>
                            <div className="space-y-2">
                                <p className="text-sm">Referrals Made: {user.referralCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-4">Earned Badges</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.length > 0 ? (
                            badges.map((badge) => (
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
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-left"><i>No badges earned yet</i></p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
