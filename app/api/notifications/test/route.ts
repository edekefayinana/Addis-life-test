import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createNotification,
  createBulkNotifications,
} from '@/lib/notification-service-new';
import { handleApiError, sendResponse } from '@/lib/error-handler';

// POST /api/notifications/test - Test notification creation (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type = 'single', userId, userIds } = body;

    if (type === 'single') {
      if (!userId) {
        return NextResponse.json(
          { error: 'userId is required for single notification' },
          { status: 400 }
        );
      }

      const notification = await createNotification({
        userId,
        title: 'Test Notification',
        body: 'This is a test notification from the new PostgreSQL-based system.',
        type: 'SYSTEM',
        link: '/dashboard',
        data: {
          testData: 'This is test data',
          timestamp: new Date().toISOString(),
        },
      });

      return sendResponse({
        message: 'Single test notification created successfully',
        notification,
      });
    } else if (type === 'bulk') {
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json(
          { error: 'userIds array is required for bulk notification' },
          { status: 400 }
        );
      }

      const notifications = await createBulkNotifications({
        userIds,
        title: 'Bulk Test Notification',
        body: 'This is a bulk test notification from the new PostgreSQL-based system.',
        type: 'SYSTEM',
        link: '/dashboard',
        data: {
          testData: 'This is bulk test data',
          timestamp: new Date().toISOString(),
        },
      });

      return sendResponse({
        message: `Bulk test notifications created successfully`,
        count: notifications.count,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "single" or "bulk"' },
        { status: 400 }
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
