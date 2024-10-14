import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
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
import { viewSalesData } from '@/features/Payment/api/sales';
import { StatCard } from '@/features/Payment/components/StatCard';
import { useQuery } from '@tanstack/react-query';
import { Download, Package } from 'lucide-react';
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

export const SalesRoute = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: viewSalesData,
  });

  const topThreeProducts = salesData?.topThreeProducts;
  const totalRevenueInDollars = salesData && salesData?.totalRevenue / 100;
  const totalUnitsSold = salesData?.totalUnitsSold;
  const topProduct = salesData?.topProduct;
  const monthlySales = salesData?.monthlySales;

  const handleExport = (format: 'excel' | 'pdf') => {
    // Implement export functionality here
    console.log(`Exporting as ${format}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wrapper space-y-6">
      <h1 className="text-3xl font-bold mb-6 ">Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          stat="Total Revenue"
          value={totalRevenueInDollars?.toFixed(2)}
          description={`+${salesData?.monthlyRevenueGrowth}% from last month`}
          icon="dollar"
        />
        <StatCard
          stat="Units Sold"
          value={totalUnitsSold?.toString()}
          description={`+${salesData?.monthlyUnitsSoldGrowth}% from last month`}
          icon="package"
        />
        <StatCard
          stat="Top Product"
          value={topProduct?.productName}
          description={`${topProduct?.unitsSold} units sold`}
          icon="trending"
        />
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle className=" text-left">Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="hsl(147, 99%, 24%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle className=" text-left">Filter Sales Data</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger
                  id="product"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                >
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
          <Button
            variant="secondary"
            className="mt-4 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full shadow-md">
        <CardHeader className="border-b">
          <CardTitle className=" text-left">
            Top Revenue Generating Products
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-4">
            {topThreeProducts?.map((product, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="secondary"
                    className="text-sm px-2 py-1 bg-secondary text-secondary-foreground font-bold"
                  >
                    #{index + 1}
                  </Badge>
                  <div>
                    <h3 className="font-medium text-foreground text-left">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Package className="h-4 w-4 text-secondary" />
                      {product.unitsSold} units sold
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <span className="text-lg font-semibold text-secondary">
                    ${product.revenue.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-left">Export Sales Report</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Download className="mr-2 h-4 w-4" /> Export as Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Download className="mr-2 h-4 w-4" /> Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
