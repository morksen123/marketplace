import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromotions } from '../hooks/usePromotions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add';

import { Promotion } from '../constants';
import { formatDisplayDate } from '@/lib/utils';

const ViewDistributorPromotions: React.FC = () => {
  const { promotions, isLoading } = usePromotions();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading promotions...</div>;
  }

  const handleCreatePromotion = () => {
    navigate('/distributor/promotions/create-promotion');
  };

  const handleEditPromotion = (id: number) => {
    navigate(`${id}`, { state: { from: 'promotions' } });
  };

  // const handlePausePromotion = (id: number) => {
  //   // Implement delete functionality
  //   console.log(`Pause promotion with id: ${id}`);
  //   editPromotionStatus({ id, data: { status: 'PAUSED' } });
  // };
  // const handleResumePromotion = (id: number) => {
  //   console.log(`Resume promotion with id: ${id}`);
  //   editPromotionStatus({ id, data: { status: 'ACTIVE' } });
  // };

  const getStatusBadge = (status: Promotion['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'PAUSED':
        return <Badge className="bg-yellow-500">Paused</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'NOT_STARTED':
        return <Badge className="bg-blue-500">Not Started</Badge>;
      default:
        return <Badge className="bg-gray-300">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Promotions</CardTitle>
          <CardDescription>
            Manage your active and upcoming promotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button className="button-green text-white hover:bg-green-600" onClick={handleCreatePromotion}>
              <AddIcon className="mr-2" />
              Create New Promotion
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions && promotions.length > 0 ? (
                promotions?.map((promotion) => (
                  <TableRow key={promotion.promotionId} className='text-left'>
                    <TableCell>{promotion.promotionName}</TableCell>
                    <TableCell>{promotion.discountPercentage}%</TableCell>
                    <TableCell>
                      {/* {new Date(promotion.startDate).toLocaleDateString()} */}
                      {formatDisplayDate(promotion.startDate)}
                    </TableCell>
                    <TableCell>
                    {formatDisplayDate(promotion.endDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleEditPromotion(promotion.promotionId)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePausePromotion(promotion.promotionId)
                          }
                        >
                          <PauseCircleIcon className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    No promotions found. Create a new one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDistributorPromotions;
