import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, LineChart } from "lucide-react";
import { WasteRecommendation } from "../types";

interface WasteRecommendationsProps {
  recommendations: WasteRecommendation[];
}

export const WasteRecommendations = ({ recommendations }: WasteRecommendationsProps) => {
  const getRecommendationIcon = (type: WasteRecommendation['recommendationType']) => {
    switch (type) {
      case 'URGENT_ACTION':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'OPTIMIZATION':
        return <LineChart className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRecommendationColor = (type: WasteRecommendation['recommendationType']) => {
    switch (type) {
      case 'URGENT_ACTION':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OPTIMIZATION':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Prevention Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {getRecommendationIcon(recommendation.recommendationType)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{recommendation.productName}</h3>
                      <Badge className={getRecommendationColor(recommendation.recommendationType)}>
                        {recommendation.recommendationType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{recommendation.recommendationText}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Potential waste prevention: {recommendation.potentialWastePrevention.toFixed(2)}kg
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No waste prevention recommendations available. There are currently no products at risk of expiring.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
