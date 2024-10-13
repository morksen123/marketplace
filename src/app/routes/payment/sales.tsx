import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/features/Payment/components/SalesCard';
import { Download } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const topProducts = [
  { name: 'Product A', sales: 1200 },
  { name: 'Product B', sales: 980 },
  { name: 'Product C', sales: 850 },
];

export const SalesRoute = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleExport = (format: 'excel' | 'pdf') => {
    // Implement export functionality here
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="wrapper space-y-6">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          stat="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
          icon="dollar"
        />

        <StatCard
          stat="Units Sold"
          value="2,345"
          description="+15% from last month"
          icon="package"
        />

        <StatCard
          stat="Top Product"
          value="Product A"
          description="1,200 units sold"
          icon="trending"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Sales Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-a">Product A</SelectItem>
                  <SelectItem value="product-b">Product B</SelectItem>
                  <SelectItem value="product-c">Product C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="secondary" className="mt-4 w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {topProducts.map((product, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span>{product.sales} units</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => handleExport('excel')}>
              <Download className="mr-2 h-4 w-4" /> Export as Excel
            </Button>
            <Button variant="secondary" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" /> Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
