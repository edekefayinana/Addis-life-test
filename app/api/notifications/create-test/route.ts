import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import {
  createSmartNotification,
  notifyAdminsNewAgentRegistration,
  notifyAdminsNewReservation,
  notifyAdminsSystemAlert,
  notifyAgentApproved,
  notifyAgentReservationConfirmed,
} from '@/lib/notification-service-new';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// POST /api/notifications/create-test - Create test notifications with smart targeting
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'ADMIN';
    let createdCount = 0;

    if (isAdmin) {
      // Admin test notifications - these will go to all admins
      await notifyAdminsNewReservation(
        'John Doe',
        'Vatican Site - Type A Three Bedroom Apartment',
        'test-reservation-1'
      );
      createdCount++;

      await notifyAdminsNewAgentRegistration(
        'Jane Smith',
        'jane.smith@example.com',
        'test-agent-1'
      );
      createdCount++;

      await notifyAdminsSystemAlert(
        'System Maintenance Scheduled',
        'Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes.',
        '/admin/system'
      );
      createdCount++;

      // Also create a personal notification for the current admin
      await createSmartNotification({
        title: 'Welcome Admin!',
        body: 'You are now using the new smart notification system. Notifications are automatically targeted based on context.',
        type: 'SYSTEM',
        link: '/admin',
        targetAudience: 'SPECIFIC_USER',
        userId: session.user.id,
        context: { adminAction: true },
        data: { testNotification: true, personalMessage: true },
      });
      createdCount++;
    } else {
      // Agent test notifications - these will go to the specific agent
      await notifyAgentReservationConfirmed(
        session.user.id,
        'African Union Site 2 - Type B Three Bedroom Apartment',
        'test-reservation-2'
      );
      createdCount++;

      await notifyAgentApproved(session.user.id, session.user.name || 'Agent');
      createdCount++;

      // Commission notification for agent
      await createSmartNotification({
        title: 'Commission Earned',
        body: 'Congratulations! You earned ETB 15,000 commission from your recent property sale.',
        type: 'COMMISSION',
        link: '/commissions',
        targetAudience: 'SPECIFIC_USER',
        userId: session.user.id,
        context: { agentId: session.user.id },
        data: {
          testNotification: true,
          amount: 15000,
          currency: 'ETB',
          propertyTitle: 'Vatican Site - Type A',
        },
      });
      createdCount++;
    }

    // System-wide notification (goes to all users)
    await createSmartNotification({
      title: 'New Feature Available',
      body: 'We have launched a new smart notification system that automatically targets the right audience!',
      type: 'SYSTEM',
      link: '/dashboard',
      targetAudience: 'ALL_ADMINS', // This will be handled by smart targeting
      context: { systemWide: true },
      data: {
        testNotification: true,
        feature: 'smart-notifications',
        version: '2.0',
      },
    });
    createdCount++;

    return sendResponse({
      message: `Successfully created ${createdCount} smart test notifications`,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      notificationsCreated: createdCount,
      smartTargeting: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
