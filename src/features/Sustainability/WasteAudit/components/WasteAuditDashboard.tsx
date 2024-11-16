import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { fetchDashboardData } from '@/features/Payment/api/sales';
import { getExpiringBatches } from '@/features/Sustainability/FoodDonation/api/food-donations';
import { foodCategoryMapping } from '@/features/Home/constants';
import { Batch } from '@/features/Sustainability/FoodDonation/types';

interface WasteMetrics {
  totalWastePrevented: number;
  monthlyWasteData: {
    name: string;
    wastePrevented: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
  }[];
  recommendations: string[];
}

export const WasteAuditDashboard = () => {
  const [metrics, setMetrics] = useState<WasteMetrics>({
    totalWastePrevented: 0,
    monthlyWasteData: [],
    categoryBreakdown: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sales data
        const salesData = await fetchDashboardData();
        
        // Fetch current inventory
        const inventoryBatches = await getExpiringBatches();
        
        // Process data for waste metrics
        const wastePrevented = processWasteMetrics(salesData, inventoryBatches);
        
        setMetrics(wastePrevented);
      } catch (error) {
        console.error('Error fetching waste audit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const processWasteMetrics = (salesData: any, inventory: Batch[]) => {
    // Calculate total waste prevented through sales
    const totalWastePrevented = salesData.totalUnitsSold * 0.5; // Assuming average weight per unit

    // Process monthly data
    const monthlyWasteData = salesData.monthlySales.map((month: any) => ({
      name: month.name,
      wastePrevented: month.sales * 0.5
    }));

    // Process category breakdown
    const categoryBreakdown = processCategoryBreakdown(inventory);

    // Generate recommendations
    const recommendations = generateRecommendations(inventory, salesData);

    return {
      totalWastePrevented,
      monthlyWasteData,
      categoryBreakdown,
      recommendations
    };
  };

  const processCategoryBreakdown = (inventory: Batch[]) => {
    const categoryMap = new Map<string, number>();
    
    inventory.forEach(batch => {
      const category = foodCategoryMapping[batch.product.foodCategory] || batch.product.foodCategory;
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + (batch.quantity * batch.weight));
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const generateRecommendations = (inventory: Batch[], salesData: any) => {
    const recommendations: string[] = [];

    // Check for items nearing expiry
    const nearExpiryItems = inventory.filter(batch => {
      const daysToExpiry = Math.ceil(
        (new Date(batch.bestBeforeDate).getTime() - new Date().getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      return daysToExpiry <= 14;
    });

    if (nearExpiryItems.length > 0) {
      recommendations.push(
        `Consider donating ${nearExpiryItems.length} items that are nearing expiry to reduce waste`
      );
    }

    // Analyze slow-moving inventory
    const slowMovingCategories = new Set<string>();
    inventory.forEach(batch => {
      const category = batch.product.foodCategory;
      const categorySales = salesData.topThreeProducts.find(
        (p: any) => p.productCategory === category
      );
      if (!categorySales) {
        slowMovingCategories.add(category);
      }
    });

    if (slowMovingCategories.size > 0) {
      recommendations.push(
        `Consider adjusting prices for slow-moving categories: ${Array.from(slowMovingCategories).join(', ')}`
      );
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Waste Audit Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold text-green-600">
                      {metrics.totalWastePrevented.toFixed(1)} kg
                    </h3>
                    <p className="text-gray-600">Total Waste Prevented</p>
                  </CardContent>
                </Card>
                
                {/* Add more overview metrics */}
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
              <div className="h-[400px] w-full">
                <LineChart data={metrics.monthlyWasteData} width={800} height={400}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="wastePrevented" 
                    stroke="#059669" 
                    name="Waste Prevented (kg)" 
                  />
                </LineChart>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="h-[400px] w-full">
                <PieChart width={800} height={400}>
                  <Pie
                    data={metrics.categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {metrics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations">
              <div className="space-y-4">
                {metrics.recommendations.map((recommendation, index) => (
                  <Alert key={index}>
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 