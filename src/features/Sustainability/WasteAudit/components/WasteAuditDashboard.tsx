import { motion } from 'framer-motion';
import { useWasteAudit } from '../hooks/useWasteAudit';
import { WasteMetricsCards } from './WasteMetricsCards';
import { WasteOverTimeChart } from './WasteOverTimeChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { WasteRecommendations } from './WasteRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, Download } from "lucide-react";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const WasteAuditDashboard = () => {
  const { wasteMetrics, recommendations, isLoading } = useWasteAudit();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wrapper space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waste Audit Dashboard</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <WasteMetricsCards metrics={wasteMetrics} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <WasteOverTimeChart data={wasteMetrics?.monthlyWastePrevention || []} />
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <CategoryBreakdownChart data={wasteMetrics?.categoryBreakdown || []} />
        </motion.div>
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <WasteRecommendations recommendations={recommendations} />
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sustainability Tips & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recommendations">
              <TabsList className="mb-4">
                <TabsTrigger value="recommendations">Smart Recommendations</TabsTrigger>
                <TabsTrigger value="tips">Waste Reduction Tips</TabsTrigger>
                <TabsTrigger value="impact">Environmental Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Focus: Inventory Optimization</h3>
                  <ul className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {rec.recommendationText}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="tips">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Implement first-in-first-out (FIFO) inventory management
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Monitor storage temperatures regularly
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Use dynamic pricing for near-expiry items
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="impact">
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-green-600">
                    {wasteMetrics ? (wasteMetrics.totalWastePrevented * 2.5).toFixed(2) : '0.00'}kg
                  </p>
                  <p className="text-sm text-gray-600">
                    CO₂ emissions prevented through waste reduction
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};