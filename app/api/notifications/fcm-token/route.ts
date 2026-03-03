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

    return NextResponse.json({
      success: true,
      message: 'FCM token saved successfully',
    });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to save FCM token' },
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
