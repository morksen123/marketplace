import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Package, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { RefundStatus, Refund } from '../types/refunds';

interface DistributorRefundsListProps {
  refunds: Refund[];
}

const STATUS_FILTERS: RefundStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED'];

const getRefundCountsByStatus = (refunds: Refund[]) => {
  const counts: Record<RefundStatus | 'ALL', number> = {
    ALL: refunds.length,
    PENDING: 0,
    ACCEPTED: 0,
    REJECTED: 0
  };

  refunds.forEach((refund) => {
    counts[refund.refundStatus]++;
  });

  return counts;
};

export const DistributorRefundsList: React.FC<DistributorRefundsListProps> = ({ refunds: distributorRefunds }) => {
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<RefundStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const refundsPerPage = 10;

  const filteredRefundsMemo = useMemo(() => {
    return distributorRefunds?.filter(refund => {
      const matchesSearch = !searchTerm.trim() || refund.refundId.toString().includes(searchTerm.toLowerCase().trim());
      const matchesStatus = activeFilter === 'ALL' || refund.refundStatus === activeFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const dateA = new Date(a.createdDateTime).getTime();
      const dateB = new Date(b.createdDateTime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }) ?? [];
  }, [distributorRefunds, searchTerm, activeFilter, sortOrder]);

  useEffect(() => {
    if (distributorRefunds) {
      setFilteredRefunds(filteredRefundsMemo);
      setCurrentPage(1);
    }
  }, [distributorRefunds, searchTerm, activeFilter, filteredRefundsMemo]);

  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadge = (status: RefundStatus) => {
    const statusColors: Record<RefundStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return <Badge className={`${statusColors[status]} font-medium`}>{status}</Badge>;
  };

  const handleFilterChange = (status: RefundStatus | 'ALL') => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const refundCounts = useMemo(() => getRefundCountsByStatus(distributorRefunds || []), [distributorRefunds]);

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <Package className="mr-2" size={20} />
          Refund Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by Refund ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center"
            >
              {sortOrder === 'asc' ? (
                <>
                  Oldest Refunds <ArrowUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Recent Refunds <ArrowDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleFilterChange('ALL')}
              variant={activeFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
            >
              All Statuses ({refundCounts.ALL})
            </Button>
            {STATUS_FILTERS.map(status => (
              <Button
                key={status}
                onClick={() => handleFilterChange(status)}
                variant={activeFilter === status ? 'default' : 'outline'}
                size="sm"
              >
                {status.charAt(0) + status.slice(1).toLowerCase()} ({refundCounts[status]})
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredRefunds.slice(indexOfFirstRefund, indexOfLastRefund).map((refund) => (
            <div key={refund.refundId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center space-x-4 flex-grow">
                <Package className="text-gray-400 flex-shrink-0" size={20} />
                
                <div className="flex items-center space-x-4 flex-grow text-left">
                  <div>
                    <h4 className="font-semibold">Refund #{refund.refundId}</h4>
                    <p className="text-sm text-gray-500">Order ID: {refund.orderId}</p>
                  </div>
                  
                  <div className="text-left">
                    <p className="font-medium">Amount: ${refund.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(refund.createdDateTime).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex flex-col items-right">
                    <p className="text-sm text-gray-500 mb-1">Status:</p>
                    {getStatusBadge(refund.refundStatus)}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Link to={`/distributor/orders/refunds/${refund.refundId}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredRefunds.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No refunds found matching your search criteria.
          </div>
        )}
        
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              {Array.from({ length: Math.ceil(filteredRefunds.length / refundsPerPage) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => paginate(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
