// Centralized Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyAW0TuB7k1zG9r2u-vvq-c7GjXQZr7sfJA',
  authDomain: 'copy-ea4e1.firebaseapp.com',
  projectId: 'copy-ea4e1',
  storageBucket: 'copy-ea4e1.firebasestorage.app',
  messagingSenderId: '173501379821',
  appId: '1:173501379821:web:924dae746568411ec3c8e4',
  measurementId: 'G-244SZLR3PC',
} as const;

// VAPID key for FCM
export const VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
  'BA6794PSnjnM-ruRgV5tLcC1ca8YK2BS_MfKaPv5r3FViX3oaEzKCEuL-Wxd_o3Lg94V7a42CLeX9DGN2BDdXQQ';
