import { get, handleErrorApi, handleSuccessApi } from '@/lib/api-client';

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

export async function downloadSalesData(type: 'pdf' | 'excel') {
  const endpoint =
    type === 'excel'
      ? '/api/transactions/export/excel'
      : '/api/transactions/export/pdf';

  const fileExtension = type === 'excel' ? 'xlsx' : 'pdf';
  const mimeType =
    type === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf';

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blobData = await response.blob();
    const blob = new Blob([blobData], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard_export.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    handleSuccessApi(
      'Success!',
      `Dashboard exported successfully as ${type.toUpperCase()}`,
    );
  } catch (error) {
    handleErrorApi(
      'Error Downloading',
      `Error exporting dashboard as ${type}:, ${error}`,
    );
  }
}
