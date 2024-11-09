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
import SustainabilityIcon from '@/assets/forest.png';
import LeaderboardIcon from '@/assets/podium.png';
import QualityIcon from '@/assets/rating.png';

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

interface BadgeDesignProps {
  badgeId: number;
  title: string;
  subtitle: string;
  criteria: string;
  earnedOn: string;
  category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
}

export const BadgeDesign: React.FC<BadgeDesignProps> = ({
  badgeId,
  title,
  subtitle,
  criteria,
  earnedOn,
  category,
}) => {
  const getBadgeIcon = () => {
    switch (category) {
      case 'SUSTAINABILITY':
        return <img src={SustainabilityIcon} alt="Sustainability" className="h-8 w-8" />;
      case 'LEADERBOARD':
        return <img src={LeaderboardIcon} alt="Leaderboard" className="h-8 w-8" />;
      case 'QUALITY_ENGAGEMENT':
        return <img src={QualityIcon} alt="Quality Engagement" className="h-8 w-8" />;
      case 'QUALITY_SERVICE':
        return <img src={QualityIcon} alt="Quality Service" className="h-8 w-8" />;
    }
  };

  const getBadgeGradient = () => {
    switch (category) {
      case 'SUSTAINABILITY':
        return 'from-green-50 to-emerald-100';
      case 'LEADERBOARD':
        return 'from-yellow-50 to-amber-100';
      case 'QUALITY_ENGAGEMENT':
        return 'from-blue-50 to-indigo-100';
      case 'QUALITY_SERVICE':
        return 'from-purple-50 to-violet-100';
    }
  };

  const isRecentlyEarned = () => {
    const earnedDate = new Date(earnedOn);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return earnedDate.toDateString() === today.toDateString() || 
           earnedDate.toDateString() === yesterday.toDateString();
  };
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`
        w-64 h-36 
        rounded-lg 
        bg-gradient-to-br ${getBadgeGradient()}
        shadow-md 
        hover:shadow-lg 
        transition-all 
        duration-300
        flex flex-col 
        items-center 
        justify-center 
        p-4
        relative
        overflow-hidden
      `}>
        {/* New Ribbon */}
        {isRecentlyEarned() && (
          <div className="absolute -right-8 top-6 rotate-45 bg-red-500 text-white px-12 py-1 text-xs font-semibold shadow-md text-center">
            New!
          </div>
        )}
        
        {/* Badge Icon */}
        <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
          {getBadgeIcon()}
        </div>

        {/* Badge Title */}
        <h3 className="font-bold text-sm text-center mb-1">{title}</h3>
        
        {/* Badge Subtitle */}
        <p className="text-xs text-center text-gray-600 mb-1">{criteria}</p>

        {/* Earned Date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(earnedOn).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
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
                                        {impactMetrics?.waterLitresSaved >= 1000000000000
                                          ? `${(impactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                                          : impactMetrics?.waterLitresSaved >= 1000000000
                                          ? `${(impactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                                          : impactMetrics?.waterLitresSaved >= 1000000
                                          ? `${(impactMetrics.waterLitresSaved / 1000000).toFixed(1)} mil`
                                          : impactMetrics?.waterLitresSaved.toFixed(0)
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
