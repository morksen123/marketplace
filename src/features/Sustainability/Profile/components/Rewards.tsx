import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Gift } from '@mui/icons-material';

export const Rewards: React.FC = () => {
  return (
    <motion.div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redeem Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Gift className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="font-bold mb-2">$5 Store Credit</h3>
                  <p className="text-sm text-gray-600 mb-4">Redeem 500 points for store credit</p>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                    Redeem 500 points
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 