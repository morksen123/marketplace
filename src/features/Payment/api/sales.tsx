import { get } from '@/lib/api-client';

interface ProductSummaryDto {
  productId: number;
  productName: string;
  unitsSold: number;
  revenue: number;
}

interface MonthlySales {
  name: string;
  sales: number;
}

interface SalesDataDto {
  distributorId: number;
  totalRevenue: number;
  totalUnitsSold: number;
  monthlyRevenueGrowth: number;
  monthlyUnitsSoldGrowth: number;
  monthlySales: MonthlySales[];
  topProduct: ProductSummaryDto;
  topProductUnitsSold: number;
  topThreeProducts: ProductSummaryDto[];
}

export async function viewSalesData() {
  const { data } = await get<SalesDataDto>(
    '/transactions/distributor-dashboard',
  );
  return data;
}
