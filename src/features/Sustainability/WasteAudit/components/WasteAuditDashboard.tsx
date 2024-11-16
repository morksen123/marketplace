import { motion } from 'framer-motion';
import { useWasteAudit } from '../hooks/useWasteAudit';
import { WasteMetricsCards } from './WasteMetricsCards';
import { WasteOverTimeChart } from './WasteOverTimeChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { WasteRecommendations } from './WasteRecommendations';
import { DonationBreakdownChart } from './DonationBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, Download } from "lucide-react";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const WasteAuditDashboard = () => {
  const { wasteMetrics, recommendations, isLoading } = useWasteAudit();

  const handleExportReport = async () => {
    const exportData = {
      wasteMetrics: {
        totalWastePrevented: wasteMetrics?.totalWastePrevented || 0,
        monthlyPrevention: wasteMetrics?.monthlyWastePrevention || [],
        categoryBreakdown: wasteMetrics?.categoryBreakdown || [],
        donationStats: wasteMetrics?.donationStats || {
          distributorDonationsByType: { COMPOSTE: 0, BIOGAS: 0, UPCYCLING: 0 },
          totalDonated: 0
        }
      },
      recommendations: recommendations || [],
      environmentalImpact: {
        co2Prevented: wasteMetrics ? (wasteMetrics.totalWastePrevented * 2.5) : 0
      }
    };

    const worksheet = XLSX.utils.json_to_sheet([
      // Summary Section
      { A: 'Waste Audit Report Summary' },
      { A: 'Generated on:', B: new Date().toLocaleDateString() },
      { A: '' },
      { A: 'Total Waste Prevented:', B: `${exportData.wasteMetrics.totalWastePrevented.toFixed(2)} kg` },
      { A: 'CO₂ Emissions Prevented:', B: `${exportData.environmentalImpact.co2Prevented.toFixed(2)} kg` },
      { A: '' },
      
      // Monthly Prevention
      { A: 'Monthly Waste Prevention' },
      ...exportData.wasteMetrics.monthlyPrevention.map(month => ({
        A: month.month,
        B: `${month.wastePrevented.toFixed(2)} kg`
      })),
      { A: '' },

      // Category Breakdown
      { A: 'Category Breakdown' },
      ...exportData.wasteMetrics.categoryBreakdown.map(cat => ({
        A: cat.category,
        B: `${cat.wastePrevented.toFixed(2)} kg`,
        C: `${cat.percentageOfTotal.toFixed(1)}%`
      })),
      { A: '' },

      // Donation Stats
      { A: 'Donation Statistics' },
      { A: 'Composting:', B: `${exportData.wasteMetrics.donationStats.distributorDonationsByType.COMPOSTE} kg` },
      { A: 'Biogas:', B: `${exportData.wasteMetrics.donationStats.distributorDonationsByType.BIOGAS} kg` },
      { A: 'Upcycling:', B: `${exportData.wasteMetrics.donationStats.distributorDonationsByType.UPCYCLING} kg` },
      { A: '' },

      // Recommendations
      { A: 'Current Recommendations' },
      ...recommendations.map(rec => ({
        A: rec.productName,
        B: rec.recommendationType,
        C: rec.recommendationText,
        D: `${rec.daysToExpiry} days to expiry`
      }))
    ]);

    // Set column widths
    const colWidths = [{ wch: 30 }, { wch: 20 }, { wch: 50 }, { wch: 20 }];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Waste Audit Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(data, `waste_audit_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wrapper space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waste Audit Dashboard</h1>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportReport}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
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
        <DonationBreakdownChart donationStats={wasteMetrics?.donationStats || { distributorDonationsByType: { COMPOSTE: 0, BIOGAS: 0, UPCYCLING: 0 } }} />
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <WasteRecommendations recommendations={recommendations} />
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
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
                  {recommendations.length > 0 ? (
                    <ul className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          {rec.recommendationText}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No smart recommendations available. There are currently no products at risk of expiring.
                    </p>
                  )}
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