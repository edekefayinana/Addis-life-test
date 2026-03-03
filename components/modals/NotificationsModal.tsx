/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { X, Bell, BellOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { getFirebaseFirestore } from '@/lib/firebase';
import {
  requestNotificationPermission,
  saveFCMToken,
  onMessageListener,
  showNotification,
} from '@/lib/fcm-service';

interface Notification {
  id: string;
  type: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  title: string;
  description: string;
  time: string;
  read?: boolean;
}

interface NotificationsModalProps {
  onClose: () => void;
}

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const { data: session } = useSession();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  // Check notification permission status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    if (!notificationsEnabled) return;

    const unsubscribe = onMessageListener((payload) => {
      console.log('Received foreground message:', payload);

      // Show browser notification
      showNotification(payload.notification?.title || 'New Notification', {
        body: payload.notification?.body || '',
        icon: '/logo.png',
        badge: '/badge.png',
        tag: payload.data?.type || 'notification',
      });

      // Optionally play a sound
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch((e) => console.log('Could not play sound:', e));
    });

    return unsubscribe;
  }, [notificationsEnabled]);

  // Fetch notifications from Firestore
  useEffect(() => {
    if (typeof window === 'undefined' || !session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const db = getFirebaseFirestore();
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', session.user.id),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const notifs: Notification[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: data.type,
              title: data.title,
              description: data.description,
              time:
                data.time ||
                new Date(
                  data.createdAt?.toDate?.() || data.createdAt
                ).toLocaleString(),
              read: data.read || false,
            };
          });
          setNotifications(notifs);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching notifications:', err);

          // Check if it's a permission error
          if (err.code === 'permission-denied') {
            setError(
              'Permission denied. Please update Firestore rules in Firebase Console.'
            );
            console.error(
              '📋 Copy the rules from firestore.rules file to Firebase Console → Firestore → Rules'
            );
          } else {
            setError('Failed to fetch notifications: ' + err.message);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error('Error initializing notifications:', e);
      setError('Failed to initialize notifications: ' + e.message);
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Request notification permission
  const handleEnableNotifications = async () => {
    if (!session?.user?.id) {
      alert('Please log in to enable notifications');
      return;
    }

    setRequestingPermission(true);
    setError(null);

    try {
      console.log('🚀 Starting notification enable process...');
      const token = await requestNotificationPermission();

      if (token) {
        console.log('✅ Token received, saving to backend...');
        // Save token to backend
        await saveFCMToken(token, session.user.id);
        setNotificationsEnabled(true);
        console.log('🎉 Notifications enabled successfully!');
        alert(
          'Notifications enabled successfully! You will now receive push notifications.'
        );
      } else {
        console.error('❌ Failed to get token');
        setError(
          'Failed to enable notifications. Please check browser console for details.'
        );
        // Don't show alert here as requestNotificationPermission already shows one
      }
    } catch (error: any) {
      console.error('❌ Error enabling notifications:', error);
      setError('Failed to enable notifications: ' + error.message);
      alert('Failed to enable notifications: ' + error.message);
    } finally {
      setRequestingPermission(false);
    }
  };

  // Group notifications
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

        {/* Enable Notifications Banner */}
        {!notificationsEnabled && (
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start gap-3">
              <BellOff className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Enable Push Notifications
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Get notified about new reservations, commissions, and updates
                </p>
                {error && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    {error}
                  </p>
                )}
                <button
                  onClick={handleEnableNotifications}
                  disabled={requestingPermission}
                  className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requestingPermission
                    ? 'Requesting...'
                    : 'Enable Notifications'}
                </button>
              </div>
            </div>
          </div>
        )}

        {notificationsEnabled && (
          <div className="p-3 bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Bell className="w-4 h-4" />
              <span>Push notifications are enabled</span>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="animate-spin h-8 w-8 mb-2" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
              <span>Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <span>{error}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <span>No notifications yet</span>
            </div>
          ) : (
            <>
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
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.read ? 'bg-gray-400' : 'bg-teal-900'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm ${notif.read ? 'text-gray-700' : 'font-medium text-gray-900'}`}
                            >
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
                            <p className="text-sm text-gray-700">
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
                            <p className="text-sm text-gray-700">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
