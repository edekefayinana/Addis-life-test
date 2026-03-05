importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: 'AIzaSyAW0TuB7k1zG9r2u-vvq-c7GjXQZr7sfJA',
  authDomain: 'copy-ea4e1.firebaseapp.com',
  projectId: 'copy-ea4e1',
  storageBucket: 'copy-ea4e1.firebasestorage.app',
  messagingSenderId: '173501379821',
  appId: '1:173501379821:web:924dae746568411ec3c8e4',
  measurementId: 'G-244SZLR3PC',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/logo.png',
    badge: '/badge.png',
    tag: payload.data?.type || 'notification',
    data: {
      url: payload.data?.link || payload.fcmOptions?.link || '/',
      ...payload.data,
    },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
