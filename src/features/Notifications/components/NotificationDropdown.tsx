import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/notification';
import { format } from 'date-fns';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (notification.messageDto) {
      navigate(`/distributor/profile/chats/${notification.messageDto.chatId}`);
    } else if (notification.orderDto) {
      navigate(`/distributor/orders/${notification.orderDto.orderId}`);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="text-sm font-medium text-gray-900">{notification.content}</div>
              <div className="text-xs text-gray-500">
                {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
