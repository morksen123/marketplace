import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/features/Payment/types/payment';
import { Truck } from 'lucide-react';
import React from 'react';

export const TransactionDetails: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => (
  <Card className="shadow-sm border border-gray-200">
    <CardHeader className="bg-gray-50 border-b border-gray-200">
      <CardTitle className="text-xl font-semibold text-gray-800">
        Additional Details
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 text-gray-600">Detail</TableHead>
            <TableHead className="text-gray-600">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction.paymentIntentId && (
            <TableRow>
              <TableCell className="font-medium text-gray-700">
                Payment Intent ID
              </TableCell>
              <TableCell className="text-gray-900">
                {transaction.paymentIntentId}
              </TableCell>
            </TableRow>
          )}
          {transaction.applicationFee && (
            <TableRow>
              <TableCell className="font-medium text-gray-700">
                Application Fee
              </TableCell>
              <TableCell className="text-gray-900">
                ${transaction.applicationFee}
              </TableCell>
            </TableRow>
          )}
          {transaction.shippingDetails && (
            <TableRow>
              <TableCell className="font-medium text-gray-700">
                Shipping Address
              </TableCell>
              <TableCell className="text-gray-900">
                <div className="flex items-start">
                  <Truck className="mr-2 mt-1 text-gray-500" size={16} />
                  <div>
                    {transaction.shippingDetails.name}
                    <br />
                    {transaction.shippingDetails.line1}
                    {transaction.shippingDetails.line2 && (
                      <>
                        <br />
                        {transaction.shippingDetails.line2}
                      </>
                    )}
                    <br />
                    {transaction.shippingDetails.city},{' '}
                    {transaction.shippingDetails.state}{' '}
                    {transaction.shippingDetails.postalCode}
                    <br />
                    {transaction.shippingDetails.country}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
