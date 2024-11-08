import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  TreeDeciduous,
  Star,
  Calendar,
} from 'lucide-react';
import { Medal, Grade as LeaderboardIcon } from '@mui/icons-material';

interface Badge {
  badgeId: number;
  title: string;
  subtitle: string;
  criteria: string;
  earnedOn: string;
  category: 'SUSTAINABILITY' | 'LEADERBOARD' | 'QUALITY_SERVICE' | 'QUALITY_ENGAGEMENT';
}

interface BadgesProps {
  badges: Badge[];
}

export const Badges: React.FC<BadgesProps> = ({ badges }) => {
  return (
    <motion.div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges && badges.length > 0 ? (
              badges.map((badge) => (
                <motion.div
                  key={badge.badgeId}
                  className="relative p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2">
                      {badge.category === 'SUSTAINABILITY' && (
                        <TreeDeciduous className="h-8 w-8 text-green-500" />
                      )}
                      {badge.category === 'LEADERBOARD' && (
                        <LeaderboardIcon className="h-8 w-8 text-yellow-500" />
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
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No badges earned yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 