import React, { useState, useEffect, useMemo } from 'react';
import { useDistributorOrders } from '../hooks/useDistributorOrders';
import { Order, OrderStatus } from '../types/orders';
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
import { Loader2, Package, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DistributorOrderListProps {
  orders: Order[];
}

const STATUS_FILTERS: OrderStatus[] = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED', 'PICKUP', 'COMPLETED', 'CANCELLED'];

const getOrderCountsByStatus = (orders: Order[]) => {
  const counts: Record<OrderStatus | 'ALL', number> = {
    ALL: orders.length,
    PENDING: 0,
    ACCEPTED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    PICKUP: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  orders.forEach((order) => {
    counts[order.status]++;
  });

  return counts;
};

export const DistributorOrderList: React.FC<DistributorOrderListProps> = () => {
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  const filteredOrdersMemo = useMemo(() => {
    return distributorOrders?.filter(order => {
      const matchesSearch = !searchTerm.trim() || order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesStatus = activeFilter === 'ALL' || order.status === activeFilter;
      const matchesDeliveryMethod = activeDeliveryMethodFilter === 'ALL' || order.orderLineItems[0].deliveryMethod === activeDeliveryMethodFilter;
      return matchesSearch && matchesStatus && matchesDeliveryMethod;
    }).sort((a, b) => {
      const dateA = new Date(a.createdDateTime).getTime();
      const dateB = new Date(b.createdDateTime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }) ?? [];
  }, [distributorOrders, searchTerm, activeFilter, activeDeliveryMethodFilter, sortOrder]);

  useEffect(() => {
    if (distributorOrders) {
      setFilteredOrders(filteredOrdersMemo);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [distributorOrders, searchTerm, activeFilter, filteredOrdersMemo]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

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
    setCurrentOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOrderId && trackingNumber) {
      setLoading(currentOrderId, true);
      try {
        await shipOrder.mutateAsync({ orderId: currentOrderId, trackingNo: trackingNumber });
        await refetchOrders();
        setIsTrackingModalOpen(false);
        setTrackingNumber('');
      } finally {
        setLoading(currentOrderId, false);
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
            {loadingStates[order.orderId] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ready for Pickup'}
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

  const orderCounts = useMemo(() => getOrderCountsByStatus(distributorOrders || []), [distributorOrders]);

  if (isLoadingOrders) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <Package className="mr-2" size={20} />
          Order Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by Buyer Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Select
              value={activeDeliveryMethodFilter}
              onValueChange={(value) => handleDeliveryMethodFilterChange(value as 'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Delivery Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Delivery Methods</SelectItem>
                <SelectItem value="DOORSTEP_DELIVERY">Delivery</SelectItem>
                <SelectItem value="SELF_PICK_UP">Self Pick-up</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center"
            >
              {sortOrder === 'asc' ? (
                <>
                  Oldest Orders <ArrowUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Recent Orders <ArrowDown className="ml-2 h-4 w-4" />
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
              All Statuses ({orderCounts.ALL})
            </Button>
            {STATUS_FILTERS.map(status => (
              <Button
                key={status}
                onClick={() => handleFilterChange(status)}
                variant={activeFilter === status ? 'default' : 'outline'}
                size="sm"
              >
                {status === 'PICKUP' ? 'Ready for Pickup' : status.charAt(0) + status.slice(1).toLowerCase()} ({orderCounts[status]})
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder).map((order) => (
            <div key={order.orderId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center space-x-4 flex-grow">
                <Package className="text-gray-400 flex-shrink-0" size={20} />
                
                <div className="flex items-center space-x-4 flex-grow text-left">
                  <div>
                    <h4 className="font-semibold">Order #{order.orderId}</h4>
                    <p className="text-sm text-gray-500">Buyer: {order.buyerEmail}</p>
                    <p className="text-sm text-gray-500">
                      Delivery: {order.orderLineItems[0].deliveryMethod === 'DOORSTEP_DELIVERY' ? 'Doorstep' : 'Self Pick-up'}
                    </p>
                  </div>
                  
                  <div className="text-left">
                    <p className="font-medium">Total: ${order.orderTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdDateTime).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex flex-col items-right">
                    <p className="text-sm text-gray-500 mb-1">Status:</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>

                <div className="flex-shrink-0 text-left">
                  <h5 className="text-sm font-medium text-gray-700">Order Items:</h5>
                  <div className="text-xs text-gray-600">
                    {order.orderLineItems.map((item, index) => (
                      <div key={index}>
                        {item.productName} - Qty: {item.quantity} | ${item.price.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              
              <div className="flex space-x-2 ml-4">
                {renderActionButtons(order)}
                <Link to={`/distributor/orders/${order.orderId}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
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

      <Dialog open={isTrackingModalOpen} onOpenChange={setIsTrackingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Tracking Number</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTrackingSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="trackingNumber" className="text-sm text-gray-600">
                  Tracking Number
                </Label>
                <Input
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105"
              >
                Ship Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
