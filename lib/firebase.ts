import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Single Firebase app instance
let firebaseApp: FirebaseApp | null = null;
let messagingInstance: Messaging | null = null;
let firestoreInstance: Firestore | null = null;

/**
 * Get or initialize Firebase app (singleton)
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;

  try {
    firebaseApp =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return firebaseApp;
  } catch (error) {
    console.error('❌ Error initializing Firebase app:', error);
    throw error;
  }
}

/**
 * Get Firebase Messaging instance (client-side only)
 */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;

  if (messagingInstance) return messagingInstance;

  try {
    const app = getFirebaseApp();
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.error('❌ Error initializing Firebase messaging:', error);
    return null;
  }
}

/**
 * Get Firestore instance
 */
export function getFirebaseFirestore(): Firestore {
  if (firestoreInstance) return firestoreInstance;

  try {
    const app = getFirebaseApp();
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    throw error;
  }
}

// Legacy exports for backward compatibility
export const app = typeof window !== 'undefined' ? getFirebaseApp() : null;
export const messaging =
  typeof window !== 'undefined' ? getFirebaseMessaging() : null;
export const db = typeof window !== 'undefined' ? getFirebaseFirestore() : null;
