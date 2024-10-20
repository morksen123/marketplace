import React, { useState, useEffect, useMemo } from 'react';
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
import { Loader2 } from 'lucide-react';

// Add this constant for delivery method options
const DELIVERY_METHODS = ['DOORSTEP_DELIVERY', 'SELF_PICK_UP'];

interface DistributorOrderListProps {
  orders: Order[];
}

const STATUS_FILTERS: OrderStatus[] = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED', 'PICKUP', 'COMPLETED', 'CANCELLED'];

export const DistributorOrderList: React.FC<DistributorOrderListProps> = ({ orders }) => {
  const { 
    orders: distributorOrders, 
    isLoadingOrders, 
    acceptOrder, 
    rejectOrder, 
    shipOrder, 
    deliverOrder,
    awaitPickupOrder,
    refetchOrders
  } = useDistributorOrders();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [activeDeliveryMethodFilter, setActiveDeliveryMethodFilter] = useState<'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP'>('ALL');

  const filteredOrdersMemo = useMemo(() => {
    return distributorOrders?.filter(order => {
      const matchesSearch = !searchTerm.trim() || order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesStatus = activeFilter === 'ALL' || order.status === activeFilter;
      const matchesDeliveryMethod = activeDeliveryMethodFilter === 'ALL' || order.orderLineItems[0].deliveryMethod === activeDeliveryMethodFilter;
      return matchesSearch && matchesStatus && matchesDeliveryMethod;
    }) ?? [];
  }, [distributorOrders, searchTerm, activeFilter, activeDeliveryMethodFilter]);

  useEffect(() => {
    if (distributorOrders) {
      setFilteredOrders(filteredOrdersMemo);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [distributorOrders, searchTerm, activeFilter, filteredOrdersMemo]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const setLoading = (orderId: number, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [orderId]: isLoading }));
  };

  const handleAwaitingPickup = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await awaitPickupOrder.mutateAsync(orderId);
      await refetchOrders();
    } finally {
      setLoading(orderId, false);
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await acceptOrder.mutateAsync(orderId);
      await refetchOrders();
    } finally {
      setLoading(orderId, false);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await rejectOrder.mutateAsync(orderId);
      await refetchOrders();
    } finally {
      setLoading(orderId, false);
    }
  };

  const handleShipOrder = async (orderId: number) => {
    const trackingNo = prompt('Enter tracking number:');
    if (trackingNo) {
      setLoading(orderId, true);
      try {
        await shipOrder.mutateAsync({ orderId, trackingNo });
        await refetchOrders();
      } finally {
        setLoading(orderId, false);
      }
    }
  };

  const handleDeliverOrder = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await deliverOrder.mutateAsync(orderId);
      await refetchOrders();
    } finally {
      setLoading(orderId, false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      PICKUP: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
    };

    const displayStatus = status === 'PICKUP' ? 'AWAITING PICKUP' : status;

    return <Badge className={`${statusColors[status]} font-medium`}>{displayStatus}</Badge>;
  };

  const handleFilterChange = (status: OrderStatus | 'ALL') => {
    setActiveFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDeliveryMethodFilterChange = (method: 'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP') => {
    setActiveDeliveryMethodFilter(method);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleAcceptOrder(order.orderId)} 
              variant="secondary"
              size="sm"
              disabled={loadingStates[order.orderId]}
            >
              {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept'}
            </Button>
            <Button 
              onClick={() => handleRejectOrder(order.orderId)} 
              variant="destructive"
              size="sm"
              disabled={loadingStates[order.orderId]}
            >
              {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
            </Button>
          </div>
        );
      case 'ACCEPTED':
        return order.orderLineItems[0].deliveryMethod === 'SELF_PICK_UP' ? (
          <Button 
            onClick={() => handleAwaitingPickup(order.orderId)} 
            variant="secondary"
            size="sm"
            disabled={loadingStates[order.orderId]}
          >
            {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Awaiting Pickup'}
          </Button>
        ) : (
          <Button 
            onClick={() => handleShipOrder(order.orderId)} 
            variant="secondary"
            size="sm"
            disabled={loadingStates[order.orderId]}
          >
            {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ship'}
          </Button>
        );
      case 'SHIPPED':
      case 'PICKUP':
        return (
          <Button 
            onClick={() => handleDeliverOrder(order.orderId)} 
            variant="secondary"
            size="sm"
            disabled={loadingStates[order.orderId]}
          >
            {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delivered'}
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoadingOrders) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search by Buyer Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={activeDeliveryMethodFilter}
              onValueChange={(value) => handleDeliveryMethodFilterChange(value as 'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Delivery Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Delivery Methods</SelectItem>
                <SelectItem value="DOORSTEP_DELIVERY">Doorstep Delivery</SelectItem>
                <SelectItem value="SELF_PICK_UP">Self Pick-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleFilterChange('ALL')}
              variant={activeFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
            >
              All Statuses
            </Button>
            {STATUS_FILTERS.map(status => (
              <Button
                key={status}
                onClick={() => handleFilterChange(status)}
                variant={activeFilter === status ? 'default' : 'outline'}
                size="sm"
              >
                {status === 'PICKUP' ? 'Awaiting Pickup' : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order No.</TableHead>
                <TableHead className="w-48">Buyer Email</TableHead>
                <TableHead className="w-24 text-right">Total</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-40">Created At</TableHead>
                <TableHead className="w-48">Items</TableHead>
                <TableHead className="w-32">Delivery Method</TableHead>
                <TableHead className="w-48">Shipping Address</TableHead>
                <TableHead className="w-32">Actions</TableHead>
                <TableHead className="w-24">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder).map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{filteredOrders.findIndex(o => o.orderId === order.orderId) + 1}</TableCell>
                  <TableCell>{order.buyerEmail}</TableCell>
                  <TableCell className="text-right font-medium">${order.orderTotal.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdDateTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.orderLineItems.map((item) => (
                        <li key={`${order.orderId}-${item.orderLineItemId}`} className="text-sm">
                          {item.productName} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    {order.orderLineItems[0].deliveryMethod === 'DOORSTEP_DELIVERY' ? 'Doorstep Delivery' : 'Self Pick-up'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.orderLineItems[0].deliveryMethod === 'DOORSTEP_DELIVERY' 
                      ? (order.shippingAddress
                          ? (typeof order.shippingAddress === 'string'
                              ? order.shippingAddress
                              : `${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}, ${order.shippingAddress.postalCode}`)
                          : 'No shipping address provided')
                      : 'Self Pick-up'}
                  </TableCell>
                  <TableCell>
                    {renderActionButtons(order)}
                  </TableCell>
                  <TableCell>
                    <Link to={`/distributor/orders/${order.orderId}`} className="text-blue-500 hover:underline">View</Link>
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
