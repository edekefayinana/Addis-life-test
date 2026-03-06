import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import { createBulkNotifications } from '@/lib/notification-service-new';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// POST /api/notifications/seed - Create sample notifications for testing (Admin only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users to create sample notifications
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      take: 10, // Limit to first 10 users
    });

    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    const userIds = users.map((user) => user.id);

    // Create sample notifications
    const sampleNotifications = [
      {
        title: 'Welcome to Addis Life RE!',
        body: 'Thank you for joining our real estate platform. Start exploring properties and opportunities.',
        type: 'SYSTEM' as const,
        link: '/dashboard',
      },
      {
        title: 'New Property Available',
        body: 'A new luxury apartment is now available in Bole area. Check it out!',
        type: 'ASSET' as const,
        link: '/properties',
      },
      {
        title: 'Commission Update',
        body: 'Your commission for last month has been calculated. Review your earnings.',
        type: 'COMMISSION' as const,
        link: '/commissions',
      },
      {
        title: 'Reservation Confirmed',
        body: 'Your property reservation has been confirmed. Next steps will be communicated soon.',
        type: 'RESERVATION' as const,
        link: '/reservations',
      },
      {
        title: 'Profile Verification Required',
        body: 'Please complete your profile verification to access all features.',
        type: 'PROFILE' as const,
        link: '/profile',
      },
    ];

    let totalCreated = 0;

    // Create notifications for each user
    for (const notification of sampleNotifications) {
      const result = await createBulkNotifications({
        userIds,
        ...notification,
        data: {
          sampleData: true,
          createdAt: new Date().toISOString(),
        },
      });
      totalCreated += result.count;
    }

    return sendResponse({
      message: `Successfully created ${totalCreated} sample notifications for ${users.length} users`,
      totalNotifications: totalCreated,
      usersCount: users.length,
      users: users.map((u) => ({ id: u.id, name: u.name, email: u.email })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
