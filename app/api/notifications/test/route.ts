/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendPushNotification } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, body, type } = await req.json();

    console.log('🧪 Test notification request:', {
      userId: session.user.id,
      title,
      body,
      type,
    });

    // Send test notification
    const result = await sendPushNotification({
      userId: session.user.id,
      title: title || 'Test Notification',
      body: body || 'This is a test notification from your app!',
      type: type || 'system',
      link: '/admin/reservations',
      data: {
        test: 'true',
        timestamp: new Date().toISOString(),
      },
    });

    console.log('✅ Test notification result:', result);

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      result,
    });
  } catch (error: any) {
    console.error('❌ Error sending test notification:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test notification',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
