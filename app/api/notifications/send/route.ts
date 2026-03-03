/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import '@/lib/firebase-admin';

interface SendNotificationRequest {
  userId: string;
  title: string;
  body: string;
  type?: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  data?: Record<string, string>;
  link?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can send notifications
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      userId,
      title,
      body,
      type = 'system',
      data = {},
      link,
    }: SendNotificationRequest = await req.json();

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'userId, title, and body are required' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const messaging = getMessaging();

    // Get user's FCM token
    const tokenDoc = await db.collection('fcmTokens').doc(userId).get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: 'User has no FCM token registered' },
        { status: 404 }
      );
    }

    const fcmToken = tokenDoc.data()?.token;

    if (!fcmToken) {
      return NextResponse.json({ error: 'Invalid FCM token' }, { status: 400 });
    }

    // Prepare notification payload
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

    // Send notification via FCM
    const response = await messaging.send(message);

    // Save notification to Firestore
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

    return NextResponse.json({
      success: true,
      messageId: response,
      message: 'Notification sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending notification:', error);

    // Handle specific FCM errors
    if (error.code === 'messaging/registration-token-not-registered') {
      return NextResponse.json(
        { error: 'FCM token is no longer valid' },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send notification', details: error.message },
      { status: 500 }
    );
  }
}

// Broadcast notification to multiple users
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      userIds,
      title,
      body,
      type = 'system',
      data = {},
      link,
    }: {
      userIds: string[];
      title: string;
      body: string;
      type?: string;
      data?: Record<string, string>;
      link?: string;
    } = await req.json();

    if (!userIds || userIds.length === 0 || !title || !body) {
      return NextResponse.json(
        { error: 'userIds, title, and body are required' },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const messaging = getMessaging();

    // Get all FCM tokens
    const tokensSnapshot = await db
      .collection('fcmTokens')
      .where('userId', 'in', userIds)
      .get();

    const tokens: string[] = [];
    tokensSnapshot.forEach((doc) => {
      const token = doc.data()?.token;
      if (token) tokens.push(token);
    });

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: 'No valid FCM tokens found for the specified users' },
        { status: 404 }
      );
    }

    // Prepare multicast message
    const message = {
      tokens,
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
        },
      },
    };

    // Send multicast notification
    const response = await messaging.sendEachForMulticast(message);

    // Save notifications to Firestore
    const batch = db.batch();
    userIds.forEach((userId) => {
      const notifRef = db.collection('notifications').doc();
      batch.set(notifRef, {
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
    });
    await batch.commit();

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      message: `Sent ${response.successCount} notifications successfully`,
    });
  } catch (error: any) {
    console.error('Error broadcasting notification:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast notification', details: error.message },
      { status: 500 }
    );
  }
}
