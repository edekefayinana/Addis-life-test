import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET /api/notifications/stats - Get notification statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get notification counts
    const [totalCount, unreadCount, readCount] = await Promise.all([
      prisma.notification.count({
        where: { userId: session.user.id },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, read: false },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, read: true },
      }),
    ]);

    // Get counts by type
    const typeStats = await prisma.notification.groupBy({
      by: ['type'],
      where: { userId: session.user.id },
      _count: {
        type: true,
      },
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return sendResponse({
      total: totalCount,
      unread: unreadCount,
      read: readCount,
      recent: recentCount,
      byType: typeStats.reduce(
        (acc, stat) => {
          acc[stat.type.toLowerCase()] = stat._count.type;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
