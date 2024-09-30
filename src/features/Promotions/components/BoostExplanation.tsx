import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  Clock,
  PauseCircle,
  Calendar,
  PlayCircle,
  X,
  AlertCircle,
} from 'lucide-react';
import { useDistributor } from '@/features/DIstributorAccount/hooks/useDistributor';

const BoostExplanation = () => {
  const { distributorProfile } = useDistributor();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white"
      >
        <Rocket className="mr-2" />
        Boost Info
      </Button>
    );
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-xl font-bold text-blue-600 flex-grow">
          <Rocket className="mr-2" />
          How does my product boosts work?
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Badge variant="secondary" className="mr-2">
              3
            </Badge>
            <p className="text-sm font-medium">Total boosts per month</p>
          </div>
          <div className="flex items-center">
            <Badge variant="secondary" className="mr-2 bg-blue-500 text-white">
              {distributorProfile?.boostCount}
            </Badge>
            <p className="text-sm font-medium">Boosts remaining this month</p>
          </div>
        </div>

        <div className="flex items-center bg-yellow-50 p-4 rounded-lg">
          <AlertCircle className="text-yellow-500 mr-2" />
          <p className="text-sm font-medium">
            Each boost lasts for <span className="font-bold">30 days</span> from
            its start date.
          </p>
        </div>

        {/* <p className="text-sm">
          Use your boosts wisely to maximize your product visibility!
        </p> */}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <Clock className="mr-2 text-yellow-500" />
            For Scheduled Boosts (Not Yet Started):
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>You can edit the start date freely</li>
            <li>Option to begin the boost immediately is available</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <PlayCircle className="mr-2 text-green-500" />
            For Active Boosts:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Start date cannot be changed once the boost is active</li>
            <li>You can pause the boost if needed</li>
            <li>
              Pausing allows you to resume later without losing your boost
            </li>
          </ul>
        </div>

        <p className="text-sm italic mt-4">
          Remember, strategic timing of your boosts can significantly impact
          your product's visibility and sales. Plan your boosts in advance for
          the best results!
        </p>
      </CardContent>
    </Card>
  );
};

export default BoostExplanation;
