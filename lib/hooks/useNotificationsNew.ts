/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'COMMISSION' | 'RESERVATION' | 'ASSET' | 'SYSTEM' | 'PROFILE';
  read: boolean;
  link?: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  recent: number;
  byType: Record<string, number>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { data: session } = useSession();
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (unreadOnly) params.append('unreadOnly', 'true');
      if (type) params.append('type', type);

      const response = await fetch(`/api/notifications?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.data.notifications);
      setPagination(data.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, page, limit, unreadOnly, type]);

  // Fetch notification stats
  const fetchStats = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/notifications/stats', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching notification stats:', err);
    }
  }, [session?.user?.id]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to mark notification as read'
        );
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      // Update stats
      setStats((prev) =>
        prev
          ? {
              ...prev,
              unread: Math.max(0, prev.unread - 1),
              read: prev.read + 1,
            }
          : null
      );

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to mark all notifications as read'
        );
      }

      const data = await response.json();

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      // Update stats immediately
      setStats((prev) =>
        prev
          ? {
              ...prev,
              unread: 0,
              read: prev.total,
            }
          : null
      );

      // Also refresh stats to ensure consistency
      setTimeout(() => {
        fetchStats();
      }, 100);

      return data.data.count;
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
      return 0;
    }
  }, [fetchStats]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete notification');
        }

        // Update local state
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );

        // Update stats
        if (deletedNotification && stats) {
          setStats((prev) =>
            prev
              ? {
                  ...prev,
                  total: prev.total - 1,
                  unread: deletedNotification.read
                    ? prev.unread
                    : Math.max(0, prev.unread - 1),
                  read: deletedNotification.read
                    ? Math.max(0, prev.read - 1)
                    : prev.read,
                  byType: {
                    ...prev.byType,
                    [deletedNotification.type.toLowerCase()]: Math.max(
                      0,
                      (prev.byType[deletedNotification.type.toLowerCase()] ||
                        0) - 1
                    ),
                  },
                }
              : null
          );
        }

        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to delete notification');
        return false;
      }
    },
    [notifications, stats]
  );

  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true);
    fetchNotifications();
    fetchStats();
  }, [fetchNotifications, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [fetchNotifications, fetchStats]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !session?.user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [
    autoRefresh,
    refreshInterval,
    fetchNotifications,
    fetchStats,
    session?.user?.id,
  ]);

  return {
    notifications,
    stats,
    pagination,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
}
