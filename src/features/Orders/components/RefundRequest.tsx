import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { handleErrorApi, handleSuccessApi, post } from '@/lib/api-client';
import { formatDisplayDate } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Order } from '../types/orders';

const refundReasons = [
  { value: 'damaged', label: 'Product arrived damaged' },
  { value: 'wrong-item', label: 'Received wrong item' },
  { value: 'not-as-described', label: 'Product not as described' },
  { value: 'changed-mind', label: 'Changed my mind' },
  { value: 'other', label: 'Other' },
];

interface RefundRequestModalProps {
  order: Order;
}

async function createRefundRequest(
  orderId: number,
  amount: number,
  refundReason: string,
  additionalDetails: string,
) {
  const body = {
    amount: amount,
    refundReason: `${refundReason}: ${additionalDetails}}`,
  };
  await post(`/buyer/order/${orderId}/refund`, body);
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  order,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const refundAmount = useMemo(() => {
    return order.orderLineItems
      .filter((item) =>
        selectedItems.has(item.orderLineItemId?.toString() || ''),
      )
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }, [selectedItems, order.orderLineItems]);

  const refundMutation = useMutation({
    mutationFn: ({
      orderId,
      amount,
      refundReason,
    }: {
      orderId: number;
      amount: number;
      refundReason: string;
    }) => createRefundRequest(orderId, amount, refundReason, details),
    onSuccess: () => {
      handleSuccessApi(
        'Refund request submitted',
        'We will process your request as soon as possible.',
      );
      setIsOpen(false);
      setReason('');
      setDetails('');
      setSelectedItems(new Set());
    },
    onError: () => {
      handleErrorApi(
        'Error',
        'Failed to submit refund request. Please try again.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      handleErrorApi('Error', 'Please select a reason for the refund.');
      return;
    }
    if (refundAmount <= 0 || refundAmount > order.orderTotal) {
      toast({
        title: 'Error',
        description: 'Please select valid items for refund.',
        variant: 'destructive',
      });
      return;
    }
    refundMutation.mutate({
      orderId: order.orderId,
      amount: refundAmount,
      refundReason: `${reason}: ${details}`,
    });
  };

  const handleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="orange">Request Refund</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request a Refund</DialogTitle>
          <DialogDescription>
            Please provide details for your refund request. We'll review it as
            soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">Order Details</h3>
            <p>Order ID: {order.orderId}</p>
            <p>Date: {formatDisplayDate(order.createdDateTime)}</p>
            <p className="font-medium mt-2">Items:</p>
            <ul className="space-y-2">
              {order.orderLineItems.map((item) => (
                <li key={item.orderLineItemId} className="flex items-center">
                  <Checkbox
                    id={`item-${item.orderLineItemId}`}
                    checked={selectedItems.has(
                      item.orderLineItemId?.toString() || '',
                    )}
                    onCheckedChange={() =>
                      handleItemSelection(
                        item.orderLineItemId?.toString() || '',
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor={`item-${item.orderLineItemId}`}
                    className="text-sm"
                  >
                    {item.productName} - ${item.price.toFixed(2)} x{' '}
                    {item.quantity}
                  </label>
                </li>
              ))}
            </ul>
            <p className="font-medium mt-2">
              Total Amount: ${order.orderTotal.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="refundAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Refund Amount
            </label>
            <p className="text-lg font-semibold">${refundAmount.toFixed(2)}</p>
          </div>
          {/* Keep the reason Select and details Textarea as they were */}
          <div className="space-y-2">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason for Refund
            </label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger id="reason" className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {refundReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Details
            </label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information about your refund request"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            variant="secondary"
            onClick={handleSubmit}
            className="w-full"
            disabled={refundMutation.isPending || selectedItems.size === 0}
          >
            {refundMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Refund Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
