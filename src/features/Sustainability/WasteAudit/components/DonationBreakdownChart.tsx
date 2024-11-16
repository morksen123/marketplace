import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Recycle, Flame, Apple } from 'lucide-react';

interface DonationBreakdownChartProps {
  donationStats: {
    distributorDonationsByType: {
      COMPOSTE: number;
      BIOGAS: number;
      UPCYCLING: number;
    };
  };
}

export const DonationBreakdownChart = ({ donationStats }: DonationBreakdownChartProps) => {
  console.log('Received donation stats:', donationStats);

  const data = [
    {
      type: 'Composting',
      value: donationStats?.distributorDonationsByType?.COMPOSTE ?? 0,
      icon: <Apple className="h-4 w-4" />,
      color: '#22c55e'
    },
    {
      type: 'Biogas', 
      value: donationStats?.distributorDonationsByType?.BIOGAS ?? 0,
      icon: <Flame className="h-4 w-4" />,
      color: '#f97316'
    },
    {
      type: 'Upcycling',
      value: donationStats?.distributorDonationsByType?.UPCYCLING ?? 0,
      icon: <Recycle className="h-4 w-4" />,
      color: '#06b6d4'
    }
  ];

  console.log('Transformed data:', data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Donation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="value"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 