import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TreeDeciduous, Star, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import SustainabilityIcon from '@/assets/forest.png';
import LeaderboardIcon from '@/assets/podium.png';
import QualityIcon from '@/assets/rating.png';

interface BadgeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'buyer' | 'distributor';
}

export const BadgeGuide: React.FC<BadgeGuideProps> = ({ isOpen, onClose, userType }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const distributorBadges = {
    sustainability: [
      {
        name: 'Waste Reducer',
        description: 'Recognises new distributors for listing near-expiry or imperfect items to minimise waste',
        criteria: 'Awarded for listing at least 5 products over the course of the first month'
      },
      {
        name: 'Waste Saver',
        description: 'Recognises distributors for consistently listing near-expiry or imperfect items to minimise waste',
        criteria: 'Awarded for consistently updating 10 new batches of products in a month'
      },
      {
        name: 'Waste Warrior',
        description: 'Celebrates distributors who actively reduce food waste by maintaining regular surplus listings',
        criteria: 'Earned by listing 10+ products each month for 6 consecutive months'
      }
    ],
    leaderboard: [
      {
        name: 'Top 10 Contributor',
        description: 'Recognises distributors who ranked in the top of the GudFood leaderboard for the past month',
        criteria: 'Awarded for placing in the top 10 of the leaderboard in the previous month'
      },
      {
        name: 'Leading Supplier', 
        description: 'Recognition for distributors who consistently rank at the top of the GudFood leaderboard',
        criteria: 'Awarded for placing in the top 3 on the leaderboard in the previous month'
      },
      {
        name: 'Steady Performer',
        description: 'Recognition for distributors who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for maintaining a top 10 leaderboard position for 3 consecutive months'
      },
      {
        name: 'Dedicated Partner',
        description: 'Recognition for distributors who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for maintaining a top 10 leaderboard position for 6 consecutive months'
      },
      {
        name: 'Champion of Change',
        description: 'Recognition for distributors who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for maintaining a top 10 leaderboard position for more than a year'
      }
    ],
    quality: [
      {
        name: 'Star Seller',
        description: 'Celebrates distributors with high ratings and positive feedback',
        criteria: 'Achieved by maintaining a minimum 4.5-star rating with 25 reviews'
      },
      {
        name: 'Trusted Distributor',
        description: 'Recognition for distributors with consistently high ratings and positive feedback',
        criteria: 'Achieved by maintaining a minimum 4.5-star rating with 50 reviews'
      },
      {
        name: 'GudFood Certified',
        description: 'Highest recognition for quality service and products sold.',
        criteria: 'Achieved by maintaining a minimum 4.5-star rating with more than 100 reviews'
      }
    ]
  };

  const buyerBadges = {
    sustainability: [
      {
        name: 'Waste Beginner',
        description: 'Recognises buyers for making their first purchase',
        criteria: 'Awarded for completing their first order'
      },
      {
        name: 'Conscious Consumer',
        description: 'Recognises buyers for consistently purchasing near-expiry or imperfect items',
        criteria: 'Awarded for purchasing at least 10 products over the course of a month'
      },
      {
        name: 'Waste Saver',
        description: 'Celebrates buyers committed to sustainable choices',
        criteria: 'Earned by purchasing 10+ products each month for 6 consecutive months'
      }
    ],
    leaderboard: [
      {
        name: 'Top Player',
        description: 'Recognition for buyers who ranked at the top of the GudFood leaderboard in the past month',
        criteria: 'Awarded for placing in the top 10 of the leaderboard in the previous month'
      },
      {
        name: 'Key Contributor', 
        description: 'Recognition for buyers who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for placing in the top 3 on the leaderboard in the previous month'
      },
      {
        name: 'Consistent Supporter',
        description: 'Recognition for buyers who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for maintaining a top 10 leaderboard position for 3 consecutive months'
      },
      {
        name: 'Loyal Customer',
        description: 'Recognition for buyers who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Earned by staying within the top 10 for six consecutive months'
      },
      {
        name: 'Sustainable Leader',
        description: 'Recognition for buyers who consistently rank in the top of the GudFood leaderboard',
        criteria: 'Awarded for holding a top 10 position for over a year'
      }
    ],
    quality: [
      {
        name: 'Positive Partner',
        description: 'Celebrates buyers who provide feedback',
        criteria: 'Achieved by providing 25 reviews'
      },
      {
        name: 'Trusted Buyer',
        description: 'Recognition for buyers who have consistently provided feedback',
        criteria: 'Achieved by providing 50 reviews'
      },
      {
        name: 'GudFood Advocate',
        description: 'Highest recognition for platform engagement',
        criteria: 'Achieved by providing 100 reviews'
      }
    ]
  };

  const badges = userType === 'distributor' ? distributorBadges : buyerBadges;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            How to Earn Badges
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="sustainability" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="sustainability">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {badges.sustainability.map((badge) => (
                <motion.div key={badge.name} variants={itemVariants}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <img
                            src={SustainabilityIcon}
                            alt="Badge Icon"
                            className="h-8 w-8"
                          />
                        </div>
                        <div className="text-center w-full">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                          <p className="text-sm text-green-600 mt-2">
                            <span className="font-medium">Criteria:</span> {badge.criteria}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {badges.leaderboard.map((badge) => (
                <motion.div key={badge.name} variants={itemVariants}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <img
                            src={LeaderboardIcon}
                            alt="Badge Icon"
                            className="h-8 w-8"
                          />
                        </div>
                        <div className="text-center w-full">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">Criteria:</span> {badge.criteria}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="quality">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {badges.quality.map((badge) => (
                <motion.div key={badge.name} variants={itemVariants}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <img
                            src={QualityIcon}
                            alt="Badge Icon"
                            className="h-8 w-8"
                          />
                        </div>
                        <div className="text-center w-full">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">Criteria:</span> {badge.criteria}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 