import { SkeletonRow } from '@/components/common/SkeletonRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePaginatedData } from '@/hooks/usePaginationData';
import { formatDisplayDate, getUserRoleFromCookie } from '@/lib/utils';
import { CreditCard, Package, SearchIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEMS_PER_PAGE } from '../constants';
import { usePayments } from '../hooks/usePayments';
import { Transaction } from '../types/payment';

export const PaymentHistory: React.FC = () => {
  const userRole = getUserRoleFromCookie();
  const { userTransactionsQuery } = usePayments();
  const { data: transactionData, isLoading } = userTransactionsQuery as {
    data: Transaction[];
    isLoading: boolean;
  };
  const navigate = useNavigate();

  const handleTransactionClick = (transactionId: number) => {
    navigate(`/transactions/${transactionId}`);
  };

  const {
    paginatedData: paginatedTransactions,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchTerm,
  } = usePaginatedData({
    data: transactionData || [],
    itemsPerPage: ITEMS_PER_PAGE,
    searchFields: ['id'],
  });

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
                <TableHead>More Details</TableHead>
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
                    <TableCell>
                      ${(transaction.amount / 100).toFixed(2)}
                    </TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionClick(transaction.id)}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 0 && (
          <Pagination className="mt-4 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};
