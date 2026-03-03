/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  requestNotificationPermission,
  saveFCMToken,
  onMessageListener,
} from '@/lib/fcm-service';

export function useNotifications() {
  const { data: session } = useSession();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if notifications are enabled
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Request permission and save token
  const enableNotifications = async () => {
    if (!session?.user?.id) {
      setError('Please log in to enable notifications');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await requestNotificationPermission();

      if (token) {
        await saveFCMToken(token, session.user.id);
        setIsEnabled(true);
        return true;
      } else {
        setError('Failed to get notification permission');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enable notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (!isEnabled) return;

    const unsubscribe = onMessageListener(() => {
      // Handle the notification here if needed
    });

    return unsubscribe;
  }, [isEnabled]);

  return {
    isEnabled,
    isLoading,
    error,
    enableNotifications,
  };
}
