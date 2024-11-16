import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WasteOverTimeChartProps {
  data: {
    month: string;
    wastePrevented: number;
  }[];
}

export const WasteOverTimeChart = ({ data }: WasteOverTimeChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Prevention Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Waste Prevented (kg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Waste Prevented']}
              />
              <Bar dataKey="wastePrevented" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
