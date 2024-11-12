import { Card } from "@/components/ui/card";
import { Recycle, TrendingDown, AlertTriangle } from "lucide-react";
import { WasteMetrics } from "../types";

interface WasteMetricsCardsProps {
  metrics: WasteMetrics | null;
}

export const WasteMetricsCards = ({ metrics }: WasteMetricsCardsProps) => {
  if (!metrics) return null;

  const cards = [
    {
      title: "Total Waste Prevented",
      value: `${metrics.totalWastePrevented.toFixed(2)}kg`,
      icon: <Recycle className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Monthly Average Prevention",
      value: `${(metrics.monthlyWastePrevention.reduce((acc, curr) => acc + curr.wastePrevented, 0) / 
        metrics.monthlyWastePrevention.length).toFixed(2)}kg`,
      icon: <TrendingDown className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "At Risk Inventory",
      value: `${metrics.categoryBreakdown.reduce((acc, curr) => acc + curr.wastePrevented, 0).toFixed(2)}kg`,
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            {card.icon}
          </div>
        </Card>
      ))}
    </div>
  );
};
