import { SkeletonRow } from '@/components/common/SkeletonRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDisplayDate, getUserRoleFromCookie } from '@/lib/utils';
import { CreditCard, Package, SearchIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { dummyData, ITEMS_PER_PAGE } from '../constants';
import { usePayments } from '../hooks/usePayments';
import { Transaction } from '../types/payment';

export const PaymentHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const userRole = getUserRoleFromCookie();
  const { userTransactions } = usePayments({ role: userRole });
  const { data: transactionData, isLoading } = userTransactions as {
    data: Transaction[];
    isLoading: boolean;
  };

  const filteredTransactions = useMemo(() => {
    if (!transactionData) return [];
    return transactionData.filter((transaction) =>
      transaction.id.toString().includes(searchTerm),
    );
  }, [transactionData, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="wrapper mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <CreditCard className="mr-2" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="text-left">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                {userRole === 'DISTRIBUTOR' && <TableHead>Status</TableHead>}
                <TableHead>Order Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      {formatDisplayDate(transaction.createdDateTime)}
                    </TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    {userRole === 'DISTRIBUTOR' && (
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === 'COMPLETED'
                              ? 'secondary'
                              : transaction.status === 'PENDING'
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Package className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>Order Details</DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Items:</h4>
                            {/* TODO: merge with transactions */}
                            {dummyData[0].orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center mb-2"
                              >
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total</span>
                              <span>${transaction.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination className="mt-4 cursor-pointer">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};
