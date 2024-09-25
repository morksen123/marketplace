// NotificationsPage.tsx
import React, { useEffect } from 'react';
import { useNotification } from '@/components/common/NotificationContext';

export const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, setNotifications } = useNotification();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications/unread`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
  
    fetchNotifications();
  }, [setNotifications]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Notifications</h2>
      <button onClick={markAllAsRead} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Mark all as read
      </button>
      <ul>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-3 mb-2 border ${notif.isRead ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => markAsRead(notif.id)}
          >
            <p>{notif.message}</p>
            <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
