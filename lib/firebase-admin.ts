/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApps } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// let app: App | undefined;
if (!getApps().length) {
  let serviceAccount: any = {};
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(
          /\\n/g,
          '\n'
        );
      }
    } catch {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
    }
  } else {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }
  // app = initializeApp({
  //   credential: cert(serviceAccount),
  // });
}
const db = getFirestore();
const messaging = getMessaging();

/**
 * Send push notification and save to Firestore
 */
export async function sendPushNotification({
  userId,
  title,
  body,
  type = 'system',
  link,
  data = {},
}: {
  userId: string;
  title: string;
  body: string;
  type?: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  link?: string;
  data?: Record<string, string>;
}) {
  try {
    // Get user's FCM token
    const tokenDoc = await db.collection('fcmTokens').doc(userId).get();

    // Save notification to Firestore (always do this, even if no token)
    await db.collection('notifications').add({
      userId,
      title,
      description: body,
      type,
      time: new Date().toLocaleString(),
      createdAt: FieldValue.serverTimestamp(),
      read: false,
      link: link || null,
      data: data || null,
    });

    // If user has FCM token, send push notification
    if (tokenDoc.exists) {
      const fcmToken = tokenDoc.data()?.token;

      if (fcmToken) {
        const message = {
          token: fcmToken,
          notification: {
            title,
            body,
          },
          data: {
            type,
            link: link || '',
            ...data,
          },
          webpush: {
            fcmOptions: {
              link: link || '/',
            },
            notification: {
              icon: '/logo.png',
              badge: '/badge.png',
              vibrate: [200, 100, 200],
            },
          },
        };

        try {
          const response = await messaging.send(message);
          return { success: true, messageId: response };
        } catch (error: any) {
          console.error('❌ Failed to send push notification:', error);

          // If token is invalid, delete it
          if (
            error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token'
          ) {
            await db.collection('fcmTokens').doc(userId).delete();
          }

          return { success: false, error: error.message };
        }
      }
    }

    return { success: true, message: 'Notification saved (no push sent)' };
  } catch (error: any) {
    console.error('❌ Error in sendPushNotification:', error);
    throw error;
  }
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use sendPushNotification instead
 */
export async function addReservationNotification({ property, user }: any) {
  await db.collection('notifications').add({
    type: 'reservation',
    title: 'New Reservation Created',
    description: `Reservation for unit ${property?.title || property?.id} by ${user?.name || user?.id}`,
    createdAt: FieldValue.serverTimestamp(),
    propertyId: property?.id,
    userId: user?.id,
    read: false,
  });
}

/**
 * Send notification to property owner when reservation is created
 */
export async function notifyPropertyOwner({
  ownerId,
  propertyTitle,
  reservationId,
  agentName,
}: {
  ownerId: string;
  propertyTitle: string;
  reservationId: string;
  agentName: string;
}) {
  return sendPushNotification({
    userId: ownerId,
    title: 'New Reservation',
    body: `${agentName} has reserved ${propertyTitle}`,
    type: 'reservation',
    link: `/admin/reservations`,
    data: {
      reservationId,
      action: 'view_reservation',
    },
  });
}

/**
 * Send notification when reservation is confirmed
 */
export async function notifyReservationConfirmed({
  agentId,
  propertyTitle,
  reservationId,
}: {
  agentId: string;
  propertyTitle: string;
  reservationId: string;
}) {
  return sendPushNotification({
    userId: agentId,
    title: 'Reservation Confirmed',
    body: `Your reservation for ${propertyTitle} has been confirmed`,
    type: 'reservation',
    link: `/admin/reservations`,
    data: {
      reservationId,
      action: 'reservation_confirmed',
    },
  });
}

/**
 * Send notification when reservation is cancelled
 */
export async function notifyReservationCancelled({
  userId,
  propertyTitle,
  reservationId,
  reason,
}: {
  userId: string;
  propertyTitle: string;
  reservationId: string;
  reason?: string;
}) {
  return sendPushNotification({
    userId,
    title: 'Reservation Cancelled',
    body: reason
      ? `Your reservation for ${propertyTitle} has been cancelled. Reason: ${reason}`
      : `Your reservation for ${propertyTitle} has been cancelled`,
    type: 'reservation',
    link: `/admin/reservations`,
    data: {
      reservationId,
      action: 'reservation_cancelled',
    },
  });
}

/**
 * Send commission notification
 */
export async function notifyCommissionApproved({
  agentId,
  amount,
  commissionId,
}: {
  agentId: string;
  amount: number;
  commissionId: string;
}) {
  return sendPushNotification({
    userId: agentId,
    title: 'Commission Approved',
    body: `Your commission of $${amount.toFixed(2)} has been approved`,
    type: 'commission',
    link: `/admin/commissions`,
    data: {
      commissionId,
      amount: amount.toString(),
      action: 'commission_approved',
    },
  });
}
