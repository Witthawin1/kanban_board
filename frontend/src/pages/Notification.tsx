import React, { useState, useEffect } from 'react';
import { getNotifications } from '../services/NotificationService';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications(1);
        setNotifications(notifications);
      } catch (err) {
        console.error(err);
        alert('Failed to load notifications');
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white p-4 rounded-xl shadow-md flex justify-between items-center ${
              notification.read_status ? 'opacity-75' : ''
            }`}
          >
            <div>
              <p className="text-blue-900 font-medium">{notification.message}</p>
              <p className="text-sm text-gray-600">{notification.type}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                notification.read_status ? 'bg-gray-200 text-gray-600' : 'bg-orange-100 text-orange-800'
              }`}
            >
              {notification.read_status ? 'Read' : 'Unread'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;