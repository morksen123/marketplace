import { CustomTooltip } from '@/components/common/CustomToolTip';
import {
  LoadingSpinner,
  LoadingSpinnerSvg,
} from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { getAllProductsByDistributor } from '@/features/DIstributorAccount/lib/distributor';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import {
  downloadSalesData,
  fetchDashboardData,
} from '@/features/Payment/api/sales';
import { StatCard } from '@/features/Payment/components/StatCard';
import { formatDisplayDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Download, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  const [startDateLabel, setStartDateLabel] = useState('');
  const [endDateLabel, setEndDateLabel] = useState('');

  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const {
    data: salesData,
    isLoading: isSalesDataLoading,
    refetch: refetchSalesData,
  } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchDashboardData(startDate, endDate, selectedProducts),
  });

  useEffect(() => {
    if (
      startDate === '' &&
      endDate === '' &&
      selectedProducts.length === 0 &&
      !isSalesDataLoading
    ) {
      refetchSalesData();
    }
  }, [
    startDate,
    endDate,
    selectedProducts,
    refetchSalesData,
    isSalesDataLoading,
  ]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartDateLabel('');
    setEndDateLabel('');
    setSelectedProducts([]);
  };

  const handleApplyFilters = async () => {
    setStartDateLabel(startDate);
    setEndDateLabel(endDate);
    await refetchSalesData();
  };

  const handleProductChange = (selected: string[]) => {
    setSelectedProducts(selected);
  };

  const { data: distributorProducts, isLoading: isProductLoading } = useQuery({
    queryKey: ['distributorProducts'],
    queryFn: getAllProductsByDistributor,
  });

  const handleExport = async (type: 'pdf' | 'excel') => {
    const setIsExporting =
      type === 'excel' ? setIsExportingExcel : setIsExportingPdf;
    setIsExporting(true);

    try {
      await downloadSalesData(type);
    } finally {
      setIsExporting(false);
    }
  };

  const topThreeProducts = salesData?.topThreeProducts;
  const totalRevenueInDollars = salesData && salesData?.totalRevenue;
  const totalUnitsSold = salesData?.totalUnitsSold;
  const topProduct = salesData?.topProduct;
  const monthlySales = salesData?.monthlySales;

  const getGrowthDescription = (
    type: 'revenue' | 'units',
    startDate: string,
    endDate: string,
  ) => {
    if (
      !salesData ||
      !Array.isArray(salesData.monthlySales) ||
      salesData.monthlySales.length === 0
    ) {
      return 'No data available';
    }
    const typeLabel = type === 'revenue' ? 'Revenue' : 'Units sold';

    if (!startDate && !endDate) {
      return `${typeLabel} for current period`;
    }

    if (startDate && !endDate) {
      return `${typeLabel} from ${startDate} onwards`;
    }

    if (!startDate && endDate) {
      return `${typeLabel} up until ${endDate}`;
    }

    return `${typeLabel} from ${startDate} to ${endDate}`;
  };

  const revenueSoldStatCardDescription = getGrowthDescription(
    'revenue',
    formatDisplayDate(startDateLabel),
    formatDisplayDate(endDateLabel),
  );
  const unitsSoldStatCardDescription = getGrowthDescription(
    'units',
    formatDisplayDate(startDateLabel),
    formatDisplayDate(endDateLabel),
  );

  if (isSalesDataLoading || isProductLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <DistributorNavMenu />
      <div className="wrapper space-y-6">
        <h1 className="text-3xl font-bold mb-6 ">Sales Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            stat="Total Revenue"
            value={totalRevenueInDollars?.toFixed(2)}
            description={revenueSoldStatCardDescription}
            icon="dollar"
          />
          <StatCard
            stat="Total Units Sold"
            value={totalUnitsSold?.toString()}
            description={unitsSoldStatCardDescription}
            icon="package"
          />
          <StatCard
            stat="Top Product"
            value={topProduct?.productName || '-'}
            description={`${topProduct?.unitsSold || 0} units sold`}
            icon="trending"
          />
        </div>

        <Card className="shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-left">Filter Sales Data</CardTitle>
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
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate} // Ensures the end date can't be before start date
                  disabled={!startDate}
                  onChange={(e) => {
                    if (new Date(e.target.value) >= new Date(startDate)) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="product">Product</Label>
                <MultiSelect
                  id="products"
                  placeholder="Select products"
                  defaultValue={selectedProducts}
                  options={
                    distributorProducts?.data?.map((product) => ({
                      label: product.listingTitle,
                      value: product.productId.toString(),
                    })) || []
                  }
                  onValueChange={handleProductChange}
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4 gap-4">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={handleApplyFilters}
                disabled={new Date(endDate) < new Date(startDate)}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

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
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sales" fill="hsl(147, 99%, 24%)" />
              </BarChart>
            </ResponsiveContainer>
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
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handleExport('excel')}
                disabled={isExportingExcel || isExportingPdf}
              >
                {isExportingExcel ? (
                  <LoadingSpinnerSvg />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export as Excel
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handleExport('pdf')}
                disabled={isExportingExcel || isExportingPdf}
              >
                {isExportingPdf ? (
                  <LoadingSpinnerSvg />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export as PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
