/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from './firebase';
import { VAPID_KEY } from './firebase-config';

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      alert('Your browser does not support service workers');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      // Get messaging instance
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        console.error('❌ Messaging not initialized');
        alert('Failed to initialize Firebase messaging');
        return null;
      }

      // Register service worker first
      try {
        // const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
      } catch (swError) {
        console.error('❌ Service worker registration failed:', swError);
        alert('Failed to register service worker: ' + swError);
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      if (token) {
        return token;
      } else {
        alert('Failed to get FCM token. Please try again.');
        return null;
      }
    } else if (permission === 'denied') {
      alert(
        'Notification permission denied. Please enable notifications in your browser settings.'
      );
      return null;
    } else {
      alert('Notification permission was not granted');
      return null;
    }
  } catch (error: any) {
    console.error('❌ Error getting notification permission:', error);
    alert('Failed to enable notifications: ' + error.message);
    return null;
  }
};

// Save FCM token to backend
export const saveFCMToken = async (token: string, userId: string) => {
  try {
    const response = await fetch('/api/notifications/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userId }),
    });

    // Check content type before parsing
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      // Try to parse error as JSON if possible
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save FCM token');
      } else {
        // If not JSON, it might be an HTML error page
        throw new Error(
          `Failed to save FCM token: ${response.status} ${response.statusText}`
        );
      }
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('❌ Error saving FCM token:', error);
    throw error;
  }
};

// Listen for foreground messages
export const onMessageListener = (callback: (payload: any) => void) => {
  const messaging = getFirebaseMessaging();
  if (!messaging) {
    console.warn('⚠️ Messaging not initialized for listener');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

// Show browser notification
export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
};
