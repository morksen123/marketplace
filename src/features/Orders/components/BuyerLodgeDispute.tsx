import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { handleErrorApi, get } from '@/lib/api-client';
import React, { useState } from 'react';
import { Order } from '../types/orders';
import { useDispute } from '@/features/Disputes/hooks/useDispute';
import { Refund } from '@/features/Refunds/types/refunds';
import { capitalizeFirstLetter } from '@/lib/utils';

interface LodgeDisputeModalProps {
  order: Order;
  refundId: number;
}

async function getRefundDetails(refundId: number) {
  const response = await get(`/buyer/orders/refunds/${refundId}`);
  return response.data;
}

export const LodgeDisputeModal: React.FC<LodgeDisputeModalProps> = ({
  order,
  refundId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [hasDisputed, setHasDisputed] = useState(false);
  const [refundDetails, setRefundDetails] = useState<Refund | null>(null);
  const [loading, setLoading] = useState(false);
  const { lodgeDispute } = useDispute();

  useEffect(() => {
    const fetchRefundDetails = async () => {
      setLoading(true);
      try {
        const details = await getRefundDetails(refundId);
        setRefundDetails(details as Refund);
      } catch (error) {
        handleErrorApi('Error', 'Failed to fetch refund details');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRefundDetails();
    }
  }, [isOpen, refundId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasDisputed(true);

    if (!details) {
      handleErrorApi('Error', 'Please enter a reason for the dispute');
      return;
    }

    lodgeDispute({
      orderId: order.orderId,
      refundId: refundId,
      disputeRequest: {
        disputeDetails: details,
        disputeAmount: order.orderTotal,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={hasDisputed} variant="destructive">
          Lodge Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lodge a Dispute</DialogTitle>
          <DialogDescription>
            Please provide details about your dispute. A gudfood admin will
            review it as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {/** Refund Details */}
        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Refund Details</h4>

          {/* Amount */}
          <div className="mb-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              ${refundDetails?.amount?.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">Refund Amount</div>
          </div>

          <div className="space-y-3 text-sm divide-y divide-slate-200">
            {/* Status with badge */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-600">Status</span>
              <span
                className="px-2 py-1 rounded-full text-xs font-medium
          'bg-red-100 text-red-700'"
              >
                {capitalizeFirstLetter(refundDetails?.refundStatus || '')}
              </span>
            </div>

            {/* Reason for refund */}
            <div className="flex flex-col gap-1 pt-2">
              <span className="text-slate-600">Reason for Refund</span>
              <span className="font-medium text-slate-900">
                {capitalizeFirstLetter(refundDetails?.refundReason || '') || 'No reason provided'}
              </span>
            </div>
          </div>
        </div>


        {/** Dispute Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="details" className="block text-sm font-medium">
              Reason for Dispute
            </label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your dispute in detail"
              rows={4}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" variant='destructive' onClick={handleSubmit}>
            Submit Dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
