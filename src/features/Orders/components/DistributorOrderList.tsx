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

interface DistributorOrderListProps {
  orders: Order[];
}

export const DistributorOrderList: React.FC<DistributorOrderListProps> = ({ orders }) => {
  const { isLoadingOrders, acceptOrder, rejectOrder, shipOrder } = useDistributorOrders();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (orders) {
      let result = orders;
      if (searchTerm) {
        result = result.filter(order => 
          order.orderId.toString().includes(searchTerm) ||
          order.buyerId.toString().includes(searchTerm)
        );
      }
      if (statusFilter !== 'ALL') {
        result = result.filter(order => order.orderStatus === statusFilter);
      }
      setFilteredOrders(result);
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
    // You might want to prompt for a tracking number here
    const trackingNo = prompt('Enter tracking number:');
    if (trackingNo) {
      shipOrder.mutate({ orderId, trackingNo });
    }
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
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <div className="flex mb-4 gap-4">
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
              <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
              <TableCell>{new Date(order.createdDateTime).toLocaleString()}</TableCell>
              <TableCell>
                {order.orderStatus === 'PENDING' && (
                  <>
                    <Button onClick={() => handleAcceptOrder(order.orderId)} className="mr-2">Accept</Button>
                    <Button onClick={() => handleRejectOrder(order.orderId)} variant="destructive">Reject</Button>
                  </>
                )}
                {order.orderStatus === 'ACCEPTED' && (
                  <Button onClick={() => handleShipOrder(order.orderId)}>Ship</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

