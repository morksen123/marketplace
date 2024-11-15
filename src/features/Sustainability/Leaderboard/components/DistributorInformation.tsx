import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TreeDeciduous, Droplets, Battery, Recycle, Star, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import food from '@/assets/food.png'
import co2 from '@/assets/co2.png'
import electricity from '@/assets/electricity.png'
import water from '@/assets/water.png'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDesign } from '../../Profile/components/BadgeDesign';
import { Package, Tag, Heart } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    email: string;
    badges?: Badge[];
}

interface DistributorInformationProps {
    user: User | null;
    isOpen: boolean;
    currentUser: User | null;
    onClose: () => void;
}

interface ImpactMetrics {
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

export const DistributorInformation: React.FC<DistributorInformationProps> = ({
    user,
    isOpen,
    onClose,
    currentUser
}) => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (user?.distributorId) {
                try {
                    const badgesResponse = await fetch(`/api/distributor/${user.distributorId}/badges`, {
                        credentials: 'include'
                    });
                    if (!badgesResponse.ok) {
                        throw new Error('Failed to fetch badges');
                    }
                    const badgesData = await badgesResponse.json();
                    setBadges(badgesData);

                    const impactResponse = await fetch(`/api/impact/distributor/${user.distributorId}`, {
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
    }, [user?.distributorId]);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Distributor Profile
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
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Community Impact</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-red-500">Weight Donated: Change</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Food Rescued Card */}
                        <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <img src={food} alt="Food" className="w-12 h-12 mb-2" />
                                <div>
                                    <h3 className="text-gray-600 mb-2 font-medium">Food Rescued</h3>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {(user.weightOfFoodSaved || 0).toFixed(1)} kg
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carbon Impact Card */}
                        <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <img src={co2} alt="CO2" className="w-12 h-12 mb-2" />
                                <div>
                                    <h3 className="text-gray-600 mb-2 font-medium">Carbon Impact</h3>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {(impactMetrics?.co2Prevented || 0).toFixed(1)} kg
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* Energy Impact Card */}
                        <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <img src={electricity} alt="Electricity" className="w-12 h-12 mb-2" />
                                <div>
                                    <h3 className="text-gray-600 mb-2 font-medium">Energy Impact</h3>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {(impactMetrics?.electricityDaysSaved || 0).toFixed(1)} days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Water Impact Card */}
                        <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <img src={water} alt="Water" className="w-12 h-12 mb-2" />
                                <div>
                                    <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {impactMetrics?.waterLitresSaved >= 1000000000000
                                            ? `${(impactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                                            : impactMetrics?.waterLitresSaved >= 1000000000
                                                ? `${(impactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                                                : impactMetrics?.waterLitresSaved >= 1000000
                                                    ? `${(impactMetrics?.waterLitresSaved / 1000000).toFixed(1)} mil`
                                                    : (impactMetrics?.waterLitresSaved || 0).toFixed(0)
                                        } ℓ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-4">Earned Badges</h3>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-y-4">
                        {badges.length > 0 ? (
                            badges.map((badge) => (
                                <BadgeDesign
                                    key={badge.badgeId}
                                    badgeId={badge.badgeId}
                                    title={badge.title}
                                    subtitle={badge.subtitle}
                                    criteria={badge.criteria}
                                    earnedOn={badge.earnedOn}
                                    category={badge.category}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-left">
                                <i>No badges earned yet</i>
                            </p>
                        )}
                    </div>
                </div>

                {/* Points Comparison */}
                {currentUser && user && currentUser.distributorId !== user.distributorId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center">
                                {currentUser.points < user.points ? (
                                    <>
                                        <h3 className="text-xl font-semibold text-black">
                                            Challenge Accepted?
                                        </h3>
                                        <p className="text-black mt-2">
                                            You're <span className="font-bold text-black">{user.points - currentUser.points}</span> points away from overtaking {user.name}!
                                        </p>
                                    </>
                                ) : currentUser.points > user.points ? (
                                    <>
                                        <h3 className="text-xl font-semibold text-black">
                                            You're Leading!
                                        </h3>
                                        <p className="text-black mt-2">
                                            You're <span className="font-bold text-black">{currentUser.points - user.points}</span> points ahead of {user.name}!
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-semibold text-black">
                                            Neck and Neck!
                                        </h3>
                                        <p className="text-black mt-2">
                                            You and {user.name} are tied with {user.points} points!
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
                {currentUser && user && currentUser.distributorId !== user.distributorId && (

                    <div>
                        <div className="grid grid-cols-3 gap-4">
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
                                        <span className="text-xl font-medium">List Products</span>
                                        <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                                            <Package className="h-5 w-5" />
                                            <span className="font-bold">Create listings</span>
                                        </div>
                                        <Link
                                            to="/create-product-listing"
                                            className="mt-1 bg-white text-teal-600 hover:bg-emerald-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Create →
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
                                        <span className="text-xl font-medium">Create Promotions</span>
                                        <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                                            <Tag className="h-5 w-5" />
                                            <span className="font-bold">Boost sales</span>
                                        </div>
                                        <Link
                                            to="/distributor/promotions"
                                            className="mt-1 bg-white text-purple-600 hover:bg-purple-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Create →
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
                                        <span className="text-xl font-medium">Make Donations</span>
                                        <div className="flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                                            <Heart className="h-5 w-5" />
                                            <span className="font-bold">Help reduce waste</span>
                                        </div>
                                        <Link
                                            to="/distributor/donations"
                                            className="mt-1 bg-white text-indigo-600 hover:bg-blue-50 font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Donate →
                                        </Link>
                                    </AlertDescription>
                                </motion.div>
                            </Alert>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
