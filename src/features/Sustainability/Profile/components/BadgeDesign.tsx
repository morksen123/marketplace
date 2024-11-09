import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import SustainabilityIcon from '@/assets/forest.png';
import LeaderboardIcon from '@/assets/podium.png';
import QualityIcon from '@/assets/rating.png';

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
        w-72 h-36 
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
}; 