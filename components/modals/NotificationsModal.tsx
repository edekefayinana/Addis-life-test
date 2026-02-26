'use client';

import { X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  title: string;
  description: string;
  time: string;
}

interface NotificationsModalProps {
  onClose: () => void;
}

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'commission',
      title: 'Commission Approved',
      description:
        'Your commission of ETB 22,550 for Unit A-304 has been approved.',
      time: 'Now',
    },
    {
      id: '2',
      type: 'commission',
      title: 'Commission Pending Approval',
      description: 'Your commission for Unit D-115 is pending admin approval.',
      time: 'Yesterday',
    },
    {
      id: '3',
      type: 'asset',
      title: 'New Marketing Assets Available',
      description:
        'New flyers and brochures of the vatican site have been added to the Marketing Assets Library.',
      time: '25 min ago',
    },
    {
      id: '4',
      type: 'reservation',
      title: 'Reservation Approved',
      description:
        'The reservation for Unit D-115 has been approved by the admin.',
      time: 'Now',
    },
    {
      id: '5',
      type: 'reservation',
      title: 'Reservation Expired',
      description:
        'The reservation for Unit C-210 has expired due to no confirmation.',
      time: '1 week ago',
    },
    {
      id: '6',
      type: 'asset',
      title: 'New Marketing Assets Available',
      description:
        'New flyers and brochures of the vatican site have been added to the Marketing Assets Library.',
      time: '2 weeks ago',
    },
    {
      id: '7',
      type: 'system',
      title: 'System Maintenance Notice',
      description:
        'Scheduled system maintenance will occur on April 10 from 1:00–3:00 AM.',
      time: '1m ago',
    },
    {
      id: '8',
      type: 'profile',
      title: 'Profile Verified',
      description: 'Your agent profile has been successfully verified.',
      time: '1m ago',
    },
  ];

  const groupedNotifications = {
    recent: notifications.slice(0, 4),
    lastWeek: notifications.slice(4, 6),
    lastMonth: notifications.slice(6),
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-96 h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {/* Recent */}
          {groupedNotifications.recent.length > 0 && (
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Recent
              </div>
              <div className="space-y-4">
                {groupedNotifications.recent.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-3 pb-4 border-b last:border-b-0"
                  >
                    <div className="w-2 h-2 bg-teal-900 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last 7 days */}
          {groupedNotifications.lastWeek.length > 0 && (
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Last 7 days
              </div>
              <div className="space-y-4">
                {groupedNotifications.lastWeek.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-3 pb-4 border-b last:border-b-0"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Month */}
          {groupedNotifications.lastMonth.length > 0 && (
            <div className="px-6 py-4">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Last Month
              </div>
              <div className="space-y-4">
                {groupedNotifications.lastMonth.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-3 pb-4 border-b last:border-b-0"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
