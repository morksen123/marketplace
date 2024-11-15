import { LoadingSpinnerSvg } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReviewModal } from '@/features/Feedback/components/ReviewsModal/ReviewModal';
import { useReviewModal } from '@/features/Feedback/hooks/useReviewModal';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Package,
  Search,
  Star,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerOrders } from '../hooks/useBuyerOrders';
import { Order, OrderStatus } from '../types/orders';

interface BuyerOrderListProps {
  orders: Order[];
}

const STATUS_FILTERS: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'SHIPPED',
  'DELIVERED',
  'PICKUP',
  'COMPLETED',
  'CANCELLED',
];

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

export const BuyerOrderList: React.FC<BuyerOrderListProps> = () => {
  const { ordersQuery, cancelOrderMutation, completeOrderMutation } =
    useBuyerOrders();
  const orders = ordersQuery.data || [];
  const orderCounts = getOrderCountsByStatus(orders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [activeDeliveryMethodFilter, setActiveDeliveryMethodFilter] = useState<
    'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP'
  >('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    isOpen,
    selectedOrder,
    currentReview,
    bulkReviews,
    activeIndex,
    openReviewModal,
    handleCloseReview,
    handleReviewChange,
    handleSubmit,
    handleNext,
    handlePrevious,
    isBulkReview,
  } = useReviewModal();

  const filteredOrdersMemo = useMemo(() => {
    return (
      orders
        .filter((order) => {
          const matchesSearch =
            !searchTerm.trim() ||
            order.distributorName
              .toLowerCase()
              .includes(searchTerm.toLowerCase().trim());
          const matchesStatus =
            activeFilter === 'ALL' || order.status === activeFilter;
          const matchesDeliveryMethod =
            activeDeliveryMethodFilter === 'ALL' ||
            order.orderLineItems[0].deliveryMethod ===
              activeDeliveryMethodFilter;
          return matchesSearch && matchesStatus && matchesDeliveryMethod;
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdDateTime).getTime();
          const dateB = new Date(b.createdDateTime).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }) ?? []
    );
  }, [orders, searchTerm, activeFilter, activeDeliveryMethodFilter, sortOrder]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(filteredOrdersMemo);
      setCurrentPage(1);
    }
  }, [orders, searchTerm, activeFilter, filteredOrdersMemo]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {},
  );

  const setLoading = (orderId: number, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [orderId]: isLoading }));
  };

  const handleCancelOrder = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await cancelOrderMutation.mutateAsync(orderId);
    } finally {
      setLoading(orderId, false);
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    setLoading(orderId, true);
    try {
      await completeOrderMutation.mutateAsync(orderId);
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

    return (
      <Badge className={`${statusColors[status]} font-medium`}>
        {displayStatus}
      </Badge>
    );
  };

  const handleFilterChange = (status: OrderStatus | 'ALL') => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const handleDeliveryMethodFilterChange = (
    method: 'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP',
  ) => {
    setActiveDeliveryMethodFilter(method);
    setCurrentPage(1);
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCancelOrder(order.orderId)}
              className="button-green"
              disabled={loadingStates[order.orderId]}
            >
              {loadingStates[order.orderId] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cancel Order'
              )}
            </Button>
          </div>
        );
      case 'DELIVERED':
      case 'PICKUP':
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCompleteOrder(order.orderId)}
            className="button-green"
            disabled={loadingStates[order.orderId]}
          >
            {loadingStates[order.orderId] ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Completed'
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  if (ordersQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinnerSvg />
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2" size={20} />
            Your Orders
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
                  placeholder="Search by Distributor Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              <Select
                value={activeDeliveryMethodFilter}
                onValueChange={(value) =>
                  handleDeliveryMethodFilterChange(
                    value as 'ALL' | 'DOORSTEP_DELIVERY' | 'SELF_PICK_UP',
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Delivery Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Delivery Methods</SelectItem>
                  <SelectItem value="DOORSTEP_DELIVERY">
                    Doorstep Delivery
                  </SelectItem>
                  <SelectItem value="SELF_PICK_UP">Self Pick-up</SelectItem>
                </SelectContent>
              </Select>
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
              {STATUS_FILTERS.map((status) => (
                <Button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  variant={activeFilter === status ? 'default' : 'outline'}
                  size="sm"
                >
                  {status === 'PICKUP'
                    ? 'Ready for Pickup'
                    : status.charAt(0) + status.slice(1).toLowerCase()}{' '}
                  ({orderCounts[status]})
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredOrders
              .slice(indexOfFirstOrder, indexOfLastOrder)
              .map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                >
                  <div className="flex items-center space-x-4 flex-grow">
                    <Package
                      className="text-gray-400 flex-shrink-0"
                      size={20}
                    />

                    <div className="flex items-center space-x-4 flex-grow text-left">
                      <div>
                        <h4 className="font-semibold">
                          Order #{order.orderId}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Distributor: {order.distributorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Delivery:{' '}
                          {order.orderLineItems[0].deliveryMethod ===
                          'DOORSTEP_DELIVERY'
                            ? 'Doorstep'
                            : 'Self Pick-up'}
                        </p>
                      </div>

                      <div className="text-left">
                        <p className="font-medium">
                          Total: ${order.orderTotal.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date:{' '}
                          {new Date(order.createdDateTime).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-right">
                        <p className="text-sm text-gray-500 mb-1">Status:</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-left">
                    <h5 className="text-sm font-medium text-gray-700">
                      Order Items:
                    </h5>
                    <div className="text-xs text-gray-600">
                      {order.orderLineItems.map((item, index) => (
                        <div key={index}>
                          {item.productName} - Qty: {item.quantity} | $
                          {item.price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* {order.reviewNeeded && (
                    <Button
                      onClick={() => openReviewModal(order)}
                      variant="outline"
                    >
                      Review
                    </Button>
                  )} */}

                  {order.reviewNeeded && (
                    <Button
                      onClick={() => openReviewModal(order)}
                      className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 font-medium transition-colors duration-200 flex items-center gap-2 ml-4"
                      variant="outline"
                    >
                      <Star className="h-4 w-4" /> {/* Add Lucide Star icon */}
                      Leave Review
                    </Button>
                  )}

                  <div className="flex space-x-2 ml-4">
                    {renderActionButtons(order)}
                    <Link to={`/buyer/orders/${order.orderId}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
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
                {Array.from(
                  { length: Math.ceil(filteredOrders.length / ordersPerPage) },
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
      <ReviewModal
        isOpen={isOpen}
        isBulkReview={isBulkReview}
        onClose={handleCloseReview}
        selectedOrder={selectedOrder}
        currentReview={currentReview}
        bulkReviews={bulkReviews}
        activeIndex={activeIndex}
        onReviewChange={handleReviewChange}
        onSubmit={handleSubmit}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};
