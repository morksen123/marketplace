import { WasteAuditDashboard } from '@/features/Sustainability/WasteAudit/components/WasteAuditDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProductsByDistributor } from '@/features/DIstributorAccount/lib/distributor';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DistributorNavMenu } from '@/features/NavigationMenu/components/DistributorNavMenu';
import { DistributorSideMenu } from '@/features/NavigationMenu/components/DistributorSideMenu';

export const WasteAuditRoute = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { data: distributorProducts, isLoading: isProductLoading } = useQuery({
    queryKey: ['distributorProducts'],
    queryFn: getAllProductsByDistributor,
  });

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedProducts([]);
  };

  const handleProductChange = (selected: string[]) => {
    setSelectedProducts(selected);
  };

  if (isProductLoading) {
    return <LoadingSpinner />;
  }

  const productOptions = distributorProducts?.data?.map((product) => ({
    value: product.productId.toString(),
    label: product.listingTitle,
  })) || [];

  return (
    <div>
       <DistributorNavMenu />
      <div className="flex">
        <DistributorSideMenu />
        <div className="container mx-auto p-6 space-y-6">
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-left">Filter Waste Audit Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Products</Label>
                  <MultiSelect
                    options={productOptions}
                    selected={selectedProducts}
                    onChange={handleProductChange}
                    placeholder="Select products..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-gray-300"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <WasteAuditDashboard />
        </div>
      </div>
    </div>
  );
};
