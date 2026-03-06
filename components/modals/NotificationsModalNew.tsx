'use client';

import { X, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
  useNotifications,
  Notification,
} from '@/lib/hooks/useNotificationsNew';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsModalProps {
  onClose: () => void;
}

export function NotificationsModalNew({ onClose }: NotificationsModalProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  //   const [typeFilter, setTypeFilter] = useState<string>('');

  const {
    notifications,
    stats,
    pagination,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    // deleteNotification,
    refresh,
  } = useNotifications({
    unreadOnly: filter === 'unread',
    // type: typeFilter || undefined,
    autoRefresh: true,
    refreshInterval: 30000,
  });

  // Group notifications by time
  const groupedNotifications = (() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recent: Notification[] = [];
    const lastWeek: Notification[] = [];
    const older: Notification[] = [];

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.createdAt);

      if (notifDate >= today) {
        recent.push(notif);
      } else if (notifDate >= sevenDaysAgo) {
        lastWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { recent, lastWeek, older };
  })();

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      // Force a refresh to update the TopBar count immediately
      refresh();
    }
  };

  const handleMarkAllAsRead = async () => {
    const count = await markAllAsRead();
    if (count > 0) {
      // Force a refresh to update the TopBar count immediately
      refresh();
    }
  };

  const renderNotificationGroup = (
    title: string,
    notifications: Notification[]
  ) => {
    if (notifications.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
              className={`flex gap-3 pb-4 border-b border-gray-200 last:border-b-0 ${
                !notif.read ? 'cursor-pointer hover:bg-gray-50' : ''
              } transition-colors`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  notif.read ? 'bg-gray-400' : 'bg-teal-900'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${
                      notif.read ? 'text-gray-700' : 'font-medium text-gray-900'
                    }`}
                  >
                    {notif.title}
                  </p>
                  <span className="text-xs text-gray-500 shrink-0">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notif.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            {stats && stats.unread > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                {stats.unread} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* All/Unread Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === 'unread'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread {stats?.unread ? `(${stats.unread})` : ''}
              </button>
            </div>

            {/* Type Filter */}
            {/* <div className="flex-1">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All types</option>
                <option value="commission">Commission</option>
                <option value="reservation">Reservation</option>
                <option value="asset">Asset</option>
                <option value="profile">Profile</option>
                <option value="system">🔔 System</option>
              </select>
            </div> */}

            {/* Mark All Read Button */}
            {stats && stats.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <RefreshCw className="animate-spin h-8 w-8 mb-2" />
              <span>Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 p-6">
              <span className="text-center">{error}</span>
              <button
                onClick={refresh}
                className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <span>
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications yet'}
              </span>
            </div>
          ) : (
            <>
              {renderNotificationGroup('Recent', groupedNotifications.recent)}
              {renderNotificationGroup(
                'Last 7 days',
                groupedNotifications.lastWeek
              )}
              {renderNotificationGroup(
                'Last Month',
                groupedNotifications.older
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                {pagination.hasPrev && (
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                    Previous
                  </button>
                )}
                {pagination.hasNext && (
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
