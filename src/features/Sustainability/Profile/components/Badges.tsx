import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BadgeGuide } from '../components/BadgeGuide';
import { BadgeDesign } from './BadgeDesign';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  userType?: 'buyer' | 'distributor';
}

export const Badges: React.FC<BadgesProps> = ({ badges, userType }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAllBadgesOpen, setIsAllBadgesOpen] = useState(false);

  const handleGuideClose = () => {
    setIsGuideOpen(false);
  };

  const displayedBadges = badges.slice(0, 9);
  const hasMoreBadges = badges.length > 9;

  return (
    <motion.div className="h-full">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Badges & Achievements
            </CardTitle>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={() => setIsGuideOpen(true)}
            >
              How to Earn?
            </button>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
            {badges && badges.length > 0 ? (
              <>
                {displayedBadges.map((badge) => (
                  <BadgeDesign
                    key={badge.badgeId}
                    badgeId={badge.badgeId}
                    title={badge.title}
                    subtitle={badge.subtitle}
                    criteria={badge.criteria}
                    earnedOn={badge.earnedOn}
                    category={badge.category}
                  />
                ))}
                {hasMoreBadges && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center col-span-2 md:col-span-3"
                  >
                    <Button
                      onClick={() => setIsAllBadgesOpen(true)}
                      variant="outline"
                      className="h-full w-1/2 bg-white/50 hover:bg-white/80"
                    >
                      View All Badges ({badges.length})
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="col-span-full flex items-center justify-center h-full text-gray-500">
                No badges earned yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BadgeGuide 
        isOpen={isGuideOpen}
        onClose={handleGuideClose}
        userType={userType}
      />

      <Dialog open={isAllBadgesOpen} onOpenChange={setIsAllBadgesOpen}>
        <DialogContent className="max-w-6xl h-[60vh] overflow-hidden flex flex-col">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center">
              All Badges & Achievements
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-center">
              View all your earned badges and their details
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="all" className="mt-4 flex-1 flex flex-col min-h-0">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto min-h-0">
              <TabsContent value="all" className="mt-6 h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                  {badges.map((badge) => (
                    <BadgeDesign
                      key={badge.badgeId}
                      badgeId={badge.badgeId}
                      title={badge.title}
                      subtitle={badge.subtitle}
                      criteria={badge.criteria}
                      earnedOn={badge.earnedOn}
                      category={badge.category}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sustainability" className="mt-6 h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                  {badges
                    .filter((badge) => badge.category === 'SUSTAINABILITY')
                    .map((badge) => (
                      <BadgeDesign
                        key={badge.badgeId}
                        badgeId={badge.badgeId}
                        title={badge.title}
                        subtitle={badge.subtitle}
                        criteria={badge.criteria}
                        earnedOn={badge.earnedOn}
                        category={badge.category}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6 h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                  {badges
                    .filter((badge) => badge.category === 'LEADERBOARD')
                    .map((badge) => (
                      <BadgeDesign
                        key={badge.badgeId}
                        badgeId={badge.badgeId}
                        title={badge.title}
                        subtitle={badge.subtitle}
                        criteria={badge.criteria}
                        earnedOn={badge.earnedOn}
                        category={badge.category}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="quality" className="mt-6 h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                  {badges
                    .filter((badge) => 
                      badge.category === 'QUALITY_SERVICE' || 
                      badge.category === 'QUALITY_ENGAGEMENT'
                    )
                    .map((badge) => (
                      <BadgeDesign
                        key={badge.badgeId}
                        badgeId={badge.badgeId}
                        title={badge.title}
                        subtitle={badge.subtitle}
                        criteria={badge.criteria}
                        earnedOn={badge.earnedOn}
                        category={badge.category}
                      />
                    ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};