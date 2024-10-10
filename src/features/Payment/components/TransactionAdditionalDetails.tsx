import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoleTypes } from '@/features/Authentication/types/auth';
import { Transaction } from '@/features/Payment/types/payment';
import React from 'react';

export const TransactionAdditionalDetails: React.FC<{
  transaction: Transaction;
  userRole: RoleTypes;
}> = ({ transaction, userRole }) => (
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
          <TableRow>
            <TableCell className="font-medium text-gray-700">
              Payment Intent ID
            </TableCell>
            <TableCell className="text-gray-900">
              {transaction.paymentIntentId}
            </TableCell>
          </TableRow>
          {userRole === 'DISTRIBUTOR' && (
            <TableRow>
              <TableCell className="font-medium text-gray-700">
                Application Fee
              </TableCell>
              <TableCell className="text-gray-900">
                ${(transaction.applicationFee / 100).toFixed(2)}
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
                  <div>
                    <span className="text-gray-700">Name:</span>{' '}
                    {transaction.shippingDetails.name}
                    <br />
                    <span className="text-gray-700">Address 1:</span>{' '}
                    {transaction.shippingDetails.line1}
                    {transaction.shippingDetails.line2 && (
                      <>
                        <br />
                        <span className="text-gray-700">Address 2:</span>{' '}
                        {transaction.shippingDetails.line2}
                      </>
                    )}
                    <br />
                    <span className="text-gray-700">Postal Code:</span>{' '}
                    {transaction.shippingDetails.postalCode}
                    <br />
                    <span className="text-gray-700">Country:</span>{' '}
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
