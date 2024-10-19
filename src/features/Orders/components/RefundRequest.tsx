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
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

const refundReasons = [
  { value: 'damaged', label: 'Product arrived damaged' },
  { value: 'wrong-item', label: 'Received wrong item' },
  { value: 'not-as-described', label: 'Product not as described' },
  { value: 'changed-mind', label: 'Changed my mind' },
  { value: 'other', label: 'Other' },
];

interface RefundRequestModalProps {
  order: {
    id: string;
    totalAmount: number;
    date: string;
    items: Array<{ id: number; name: string; price: number }>;
  };
}

async function createRefundRequest(
  orderId: number,
  amount: number,
  refundReason: string,
) {
  const body = {
    amount: amount,
    refundReason: refundReason,
  };
  const response = await fetch(`/api/buyer/order/${orderId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Failed to submit refund request');
  }
  return response.json();
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  order,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState(order.totalAmount.toString());

  const refundMutation = useMutation({
    mutationFn: ({
      orderId,
      amount,
      refundReason,
    }: {
      orderId: number;
      amount: number;
      refundReason: string;
    }) => createRefundRequest(orderId, amount, refundReason),
    onSuccess: () => {
      toast({
        title: 'Refund request submitted',
        description: 'We will process your request as soon as possible.',
      });
      setIsOpen(false);
      setReason('');
      setDetails('');
      setAmount(order.totalAmount.toString());
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit refund request. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast({
        title: 'Error',
        description: 'Please select a reason for the refund.',
        variant: 'destructive',
      });
      return;
    }
    if (parseFloat(amount) <= 0 || parseFloat(amount) > order.totalAmount) {
      toast({
        title: 'Error',
        description: 'Please enter a valid refund amount.',
        variant: 'destructive',
      });
      return;
    }
    refundMutation.mutate({
      orderId: parseInt(order.id),
      amount: parseFloat(amount),
      refundReason: `${reason}: ${details}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Request Refund</Button>
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
            <p>Order ID: {order.id}</p>
            <p>Date: {order.date}</p>
            <p className="font-medium mt-2">Items:</p>
            <ul className="list-disc list-inside">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-medium mt-2">
              Total Amount: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Items to Refund
            </label>
            <MultiSelect
              id="products"
              placeholder="Select products"
              options={
                refundReasons?.map((product) => ({
                  label: product.label,
                  value: product.value,
                })) || []
              }
              onValueChange={() => console.log('on value change')}
              className="py-2 px-0"
            />
          </div>
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
            disabled={refundMutation.isPending}
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

// Example usage in the OrderDetails component
export const OrderDetails: React.FC = () => {
  // Assume we have the order details available
  const order = {
    id: '12345',
    totalAmount: 129.99,
    date: '2023-06-15',
    items: [
      { id: 1, name: 'Wireless Headphones', price: 79.99 },
      { id: 2, name: 'Phone Case', price: 19.99 },
      { id: 3, name: 'Screen Protector', price: 30.01 },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      {/* Order details content */}
      <div className="mt-4">
        <RefundRequestModal order={order} />
      </div>
    </div>
  );
};
