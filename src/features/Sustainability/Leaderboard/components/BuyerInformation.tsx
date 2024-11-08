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

export const BuyerInformation: React.FC<BuyerInformationProps> = ({
    user,
    isOpen,
    onClose,
    currentUser
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


                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Community Impact</h3>
                            <div className="space-y-2">
                                <p className="text-sm">Referrals Made: {user.referralCount}</p>
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
                                        {impactMetrics?.weightSaved.toFixed(1)} kg
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
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {impactMetrics?.co2Prevented.toFixed(1)} kg
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
                                        {impactMetrics?.electricityDaysSaved.toFixed(1)} days
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
                                        {impactMetrics?.waterLitresSaved.toFixed(0)} L
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-4">Earned Badges</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.length > 0 ? (
                            badges.map((badge) => (
                                <div key={badge.badgeId}>
                                    <div className="flex flex-col items-center text-center shadow-lg rounded-xl p-4">
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
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-left"><i>No badges earned yet</i></p>
                        )}
                    </div>
                </div>

                {/* Points Comparison */}
                {currentUser && user && currentUser.buyerId !== user.buyerId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                            rounded-xl p-6 shadow-md
                            ${currentUser.points < user.points 
                                ? 'bg-gradient-to-br from-emerald-50 to-teal-100' 
                                : 'bg-gradient-to-br from-blue-50 to-indigo-100'
                            }
                        `}
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
                            <Link
                                to="/buyer/home"
                                onClick={() => {
                                    onClose();
                                    setTimeout(() => {
                                        const productsSection = document.querySelector('.wrapper');
                                        productsSection?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                }}
                                className={`
                                    px-6 py-2 rounded-full transition-all transform 
                                    hover:-translate-y-0.5 hover:shadow-lg
                                    ${currentUser.points < user.points 
                                        ? 'bg-white text-teal-600 hover:bg-emerald-50' 
                                        : currentUser.points > user.points 
                                            ? 'bg-white text-indigo-500 hover:bg-purple-50'
                                            : 'bg-white text-indigo-500 hover:bg-purple-50'
                                    }
                                `}
                            >
                                {currentUser.points <= user.points 
                                    ? "Start Shopping Now →"
                                    : `Start Shopping Now - Don't Let ${user.name} Catch Up! →`
                                }
                            </Link>
                        </div>
                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
};
