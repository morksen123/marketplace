import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Star, Scale, Medal } from 'lucide-react';

interface PointsGuideProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: 'buyer' | 'distributor';
}

export const PointsGuide: React.FC<PointsGuideProps> = ({ isOpen, onClose, userType = 'buyer' }) => {
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

  const buyerPoints = [
    {
      title: 'Food Saved',
      description: 'Points awarded based on purchase value',
      criteria: '10 points per $ of product purchased',
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Monthly Purchase Frequency',
      description: 'Multiplier effect based on monthly activity',
      criteria: 'Points multiplier increases with more purchases',
      icon: <Scale className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Reviews & Feedback',
      description: 'Points for providing product feedback',
      criteria: '5 points per feedback submitted',
      icon: <Star className="h-6 w-6 text-yellow-500" />
    },
    {
      title: 'Referral Program',
      description: 'Points for successful referrals',
      criteria: '250 points when referred friend makes $100+ purchase',
      icon: <Users className="h-6 w-6 text-purple-500" />
    },
    {
        title: 'Badges Earned',
        description: 'Points for badges earned', 
        criteria: '50 points for each badge earned',
        icon: <Medal className="h-6 w-6 text-red-500" />
      }
  ];

  const distributorPoints = [
    {
      title: 'Surplus Food Sales',
      description: 'Points based on order value',
      criteria: '10 points per $ of product sold',
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Food Donations',
      description: 'Points for food donations',
      criteria: '2 points per 5kg donated',
      icon: <Scale className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Customer Satisfaction',
      description: 'Points for positive ratings',
      criteria: '5 points per 5-star rating',
      icon: <Star className="h-6 w-6 text-yellow-500" />
    }
  ];

  const points = userType === 'distributor' ? distributorPoints : buyerPoints;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            How to Earn Points
          </DialogTitle>
        </DialogHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          {points.map((point, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{point.description}</p>
                  <p className="text-sm font-medium text-green-600">{point.criteria}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
