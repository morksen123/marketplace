import { Badge } from '@/components/ui/badge';
import { Notification } from '@/types/notification';
import { format } from 'date-fns';
import { Bell, MessageCircle, Package } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/utils';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationRead: (notificationId: string) => void;
  userRole: 'buyer' | 'distributor';
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
  onNotificationRead,
  userRole,
}) => {
  const navigate = useNavigate();

  console.log(notifications);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      if (response.ok) {
        onNotificationRead(notificationId); // Call this immediately after successful API call
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead(notification.notificationId.toString());
    const baseRoute = userRole === 'buyer' ? '/buyer' : '/distributor';

    if (notification.content === 'New Message' && notification.messageDto) {
      navigate(`${baseRoute}/profile/chats`);
    } else if (notification.content === 'Order Status Updated' && notification.orderDto) {
      if (['IN_REFUND', 'REFUNDED', 'REFUND_REJECTED'].includes(notification.orderStatus)) {
        navigate(`${baseRoute}/orders/refunds/${notification.orderDto.refundId}`);
      } else {
        navigate(`${baseRoute}/orders/${notification.orderDto.orderId}`);
      }
    } else if (notification.content === 'Dispute Status Updated' && notification.orderDto) {
      navigate(`${baseRoute}/orders/disputes/${notification.orderDto.disputeId}`);
    } else if (notification.content === 'New Order Created' && notification.orderDto) {
      navigate(`${baseRoute}/orders/${notification.orderDto.orderId}`);
    } else if (notification.content.includes('star')) {
      navigate(`/view-product-listing/${notification.productId}`);
    } else if (notification.content.includes('responded to your review')) {
      navigate(`/buyer/view-product/${notification.productId}`);
    } else if (notification.content === 'New Badge Earned') {
      navigate(`${baseRoute}/profile`);
    }
    onClose();
  };

  const getNotificationIcon = (content: string) => {
    switch (content) {
      case 'New Message':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'New Order Created':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'Order Status Updated':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'New Badge Earned':
        return <Medal className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      PICKUP: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      REFUNDED: 'bg-pink-100 text-pink-800',
      IN_REFUND: 'bg-indigo-100 text-indigo-800',
      REFUND_REJECTED: 'bg-rose-100 text-rose-800',
      IN_DISPUTE: 'bg-amber-100 text-amber-800'
    };

    const displayStatus = status === 'PICKUP' ? 'AWAITING PICKUP' : capitalizeFirstLetter(status);

    return (
      <Badge
        className={`${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        } text-xs px-1 py-0.5`}
      >
        {displayStatus}
      </Badge>
    );
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2 max-h-80 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-700">
            No new notifications
          </div>
        ) : (
          sortedNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  {getNotificationIcon(notification.content)}
                </div>
                <div className="flex-grow max-w-[280px]">
                  <div className="text-sm font-medium text-gray-900 text-left break-words">
                    {notification.content}
                  </div>
                  <div className="text-xs text-gray-500 text-left">
                    {format(
                      new Date(notification.createdAt),
                      'MMM d, yyyy HH:mm',
                    )}
                  </div>
                  {notification.content === 'New Message' &&
                    notification.messageDto && (
                      <div className="text-xs text-gray-600 text-left break-words">
                        From: {notification.buyerNameString}
                      </div>
                    )}
                  {notification.content === 'New Order Created' &&
                    notification.orderDto && (
                      <div className="text-xs text-gray-600 text-left break-words">
                        Order #{notification.orderDto.orderId} from{' '}
                        {notification.buyerNameString}
                      </div>
                    )}
                  {notification.content === 'Order Status Updated' &&
                    notification.orderDto && (
                      <div className="text-xs text-gray-600 flex items-center flex-wrap gap-1">
                        <span>Order #{notification.orderDto.orderId}:</span>{' '}
                        {getStatusBadge(notification.orderStatus)}
                      </div>
                    )}
                  {notification.content === 'Dispute Status Updated' &&
                    notification.orderDto && (
                      <div className="text-xs text-gray-600 flex items-center flex-wrap gap-1">
                        Order #{notification.orderDto.orderId}: {getStatusBadge(notification.orderStatus)}
                      </div>
                    )}
                  {notification.content === 'New Badge Earned' && (
                    <div className={`text-xs text-gray-600 flex items-center flex-wrap gap-1`}>
                      <span>Another badge earned!</span>{' '}
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0 mt-1"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
