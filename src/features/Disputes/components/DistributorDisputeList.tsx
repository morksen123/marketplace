import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { AlertTriangle, Search, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { DisputeStatus, Dispute } from '../constants';

interface DistributorDisputeListProps {
  disputes: Dispute[];
}

const STATUS_FILTERS: DisputeStatus[] = ['PENDING', 'REJECTED', 'RESOLVED'];

const getDisputeCountsByStatus = (disputes: Dispute[]) => {
  const counts: Record<DisputeStatus | 'ALL', number> = {
    ALL: disputes.length,
    PENDING: 0,
    REJECTED: 0,
    RESOLVED: 0,
  };

  disputes.forEach((dispute: Dispute) => {
    counts[dispute.disputeStatus]++;
  });

  return counts;
};

export const DistributorDisputeList: React.FC<DistributorDisputeListProps> = ({
  disputes: distributorDisputes,
}) => {
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<DisputeStatus | 'ALL'>(
    'ALL',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const disputesPerPage = 10;

  const filteredDisputesMemo = useMemo(() => {
    return (
      distributorDisputes
        ?.filter((dispute) => {
          const matchesSearch =
            !searchTerm.trim() ||
            dispute.disputeId
              .toString()
              .includes(searchTerm.toLowerCase().trim());
          const matchesStatus =
            activeFilter === 'ALL' || dispute.disputeStatus === activeFilter;
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdOn).getTime();
          const dateB = new Date(b.createdOn).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }) ?? []
    );
  }, [distributorDisputes, searchTerm, activeFilter, sortOrder]);

  useEffect(() => {
    if (distributorDisputes) {
      setFilteredDisputes(filteredDisputesMemo);
      setCurrentPage(1);
    }
  }, [distributorDisputes, searchTerm, activeFilter, filteredDisputesMemo]);

  const indexOfLastDispute = currentPage * disputesPerPage;
  const indexOfFirstDispute = indexOfLastDispute - disputesPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadge = (status: DisputeStatus) => {
    const statusColors: Record<DisputeStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      RESOLVED: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={`${statusColors[status]} font-medium`}>{status}</Badge>
    );
  };

  const handleFilterChange = (status: DisputeStatus | 'ALL') => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const disputeCounts = useMemo(
    () => getDisputeCountsByStatus(distributorDisputes || []),
    [distributorDisputes],
  );

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Dispute Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search by Dispute ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className="flex items-center"
            >
              {sortOrder === 'asc' ? (
                <>
                  Oldest Disputes <ArrowUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Recent Disputes <ArrowDown className="ml-2 h-4 w-4" />
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
              All Statuses ({disputeCounts.ALL})
            </Button>
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                onClick={() => handleFilterChange(status)}
                variant={activeFilter === status ? 'default' : 'outline'}
                size="sm"
              >
                {status.charAt(0) + status.slice(1).toLowerCase()} (
                {disputeCounts[status]})
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <Info className="mr-2 text-blue-600" size={20} />
            <p className="text-sm text-blue-600">
              All pending disputes are reviewed and handled by GudFood Admin within 2-3
              business days.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {filteredDisputes
            .slice(indexOfFirstDispute, indexOfLastDispute)
            .map((dispute) => (
              <div
                key={dispute.disputeId}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4 flex-grow">
                  <AlertTriangle
                    className="text-amber-500 flex-shrink-0"
                    size={20}
                  />

                  <div className="flex items-center space-x-4 flex-grow text-left">
                    <div>
                      <h4 className="font-semibold">
                        Dispute #{dispute.disputeId}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Order ID: {dispute.orderId}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="font-medium text-gray-700">
                        Reason: {dispute.disputeDetails}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(dispute.createdOn).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-right">
                      <p className="text-sm text-gray-500 mb-1">Status:</p>
                      {getStatusBadge(dispute.disputeStatus)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Link
                    to={`/distributor/orders/disputes/${dispute.disputeId}`}
                  >
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No disputes found matching your search criteria.
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              {Array.from(
                {
                  length: Math.ceil(filteredDisputes.length / disputesPerPage),
                },
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => paginate(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
