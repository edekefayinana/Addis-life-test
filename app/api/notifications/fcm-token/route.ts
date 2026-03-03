/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFirestore } from 'firebase-admin/firestore';
import '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    console.log('💾 Saving FCM token for user:', session.user.id);

    const db = getFirestore();

    // Save or update FCM token for the user
    await db.collection('fcmTokens').doc(session.user.id).set(
      {
        userId: session.user.id,
        token,
        updatedAt: new Date().toISOString(),
        platform: 'web',
      },
      { merge: true }
    );

    console.log('✅ FCM token saved successfully');

    return NextResponse.json({
      success: true,
      message: 'FCM token saved successfully',
    });
  } catch (error: any) {
    console.error('❌ Error saving FCM token:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Failed to save FCM token: ${error.message}` },
      { status: 500 }
    );
  }
}
// req: NextRequest
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirestore();

    // Delete FCM token
    await db.collection('fcmTokens').doc(session.user.id).delete();

    return NextResponse.json({
      success: true,
      message: 'FCM token deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to delete FCM token' },
      { status: 500 }
    );
  }
}
