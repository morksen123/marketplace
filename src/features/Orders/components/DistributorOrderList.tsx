import React, { useState, useEffect } from 'react';
import { useDistributorOrders } from '../hooks/useDistributorOrders';
import { Order, OrderStatus } from '../types/orders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

interface DistributorOrderListProps {
  orders: Order[];
}

export const DistributorOrderList: React.FC<DistributorOrderListProps> = ({ orders }) => {
  const { isLoadingOrders, acceptOrder, rejectOrder, shipOrder, deliverOrder } = useDistributorOrders();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (orders) {
      let result = orders;
      if (searchTerm.trim()) {
        const lowercasedSearch = searchTerm.toLowerCase().trim();
        result = result.filter(order => 
          order.orderId.toString().toLowerCase().includes(lowercasedSearch) ||
          order.buyerId.toString().toLowerCase().includes(lowercasedSearch)
        );
      }
      if (statusFilter !== 'ALL') {
        result = result.filter(order => order.status === statusFilter);
      }
      setFilteredOrders(result);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [orders, searchTerm, statusFilter]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAcceptOrder = (orderId: number) => {
    acceptOrder.mutate(orderId);
  };

  const handleRejectOrder = (orderId: number) => {
    rejectOrder.mutate(orderId);
  };

  const handleShipOrder = (orderId: number) => {
    const trackingNo = prompt('Enter tracking number:');
    if (trackingNo) {
      shipOrder.mutate({ orderId, trackingNo });
    }
  };

  const handleDeliverOrder = (orderId: number) => {
    deliverOrder.mutate(orderId);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-500',
      ACCEPTED: 'bg-blue-500',
      CANCELLED: 'bg-red-500',
      SHIPPED: 'bg-purple-500',
      DELIVERED: 'bg-green-500',
      COMPLETED: 'bg-gray-500',
    };

    return <Badge className={statusColors[status]}>{status}</Badge>;
  };

  if (isLoadingOrders) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row mb-4 gap-4">
          <Input
            placeholder="Search by Order ID or Buyer ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select onValueChange={(value) => setStatusFilter(value as OrderStatus | 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer ID</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.buyerId}</TableCell>
                  <TableCell>${order.orderTotal.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdDateTime).toLocaleString()}</TableCell>
                  <TableCell>
                    {order.status === 'PENDING' && (
                      <>
                        <Button onClick={() => handleAcceptOrder(order.orderId)} className="mr-2" variant="secondary">Accept</Button>
                        <Button onClick={() => handleRejectOrder(order.orderId)} variant="destructive">Reject</Button>
                      </>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <Button onClick={() => handleShipOrder(order.orderId)} variant="secondary">Ship</Button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <Button onClick={() => handleDeliverOrder(order.orderId)} variant="secondary">Deliver</Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/distributor/orders/${order.orderId}`}>View Details</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No orders found matching your search criteria.
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
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
