/* eslint-disable @typescript-eslint/no-explicit-any */
// PostgreSQL-based notification service with smart targeting
// Use this in your API routes to send notifications

interface SendNotificationParams {
  userId?: string; // Optional - if not provided, will determine based on type and context
  title: string;
  body: string;
  type?: 'COMMISSION' | 'RESERVATION' | 'ASSET' | 'SYSTEM' | 'PROFILE';
  link?: string;
  data?: Record<string, any>;
  // New parameters for smart targeting
  targetAudience?: 'AGENT' | 'ADMIN' | 'ALL_ADMINS' | 'SPECIFIC_USER';
  context?: {
    agentId?: string;
    adminAction?: boolean;
    systemWide?: boolean;
  };
}

interface BroadcastNotificationParams {
  userIds?: string[];
  title: string;
  body: string;
  type?: 'COMMISSION' | 'RESERVATION' | 'ASSET' | 'SYSTEM' | 'PROFILE';
  link?: string;
  data?: Record<string, any>;
  targetAudience?: 'ALL_ADMINS' | 'ALL_AGENTS' | 'SPECIFIC_USERS';
}

// Smart notification targeting logic
async function determineTargetUsers(
  params: SendNotificationParams
): Promise<string[]> {
  const { userId, type, targetAudience, context } = params;

  // If specific user ID is provided, use it
  if (userId && targetAudience === 'SPECIFIC_USER') {
    return [userId];
  }

  // If explicitly targeting all admins
  if (targetAudience === 'ALL_ADMINS') {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });
    return admins.map((admin) => admin.id);
  }

  // Smart targeting based on notification type and context
  switch (type) {
    case 'RESERVATION':
      if (context?.adminAction) {
        // Admin actions on reservations go to all admins
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        return admins.map((admin) => admin.id);
      } else if (context?.agentId) {
        // Agent-specific reservation notifications
        return [context.agentId];
      }
      break;

    case 'PROFILE':
      if (context?.adminAction) {
        // Profile approvals, new registrations go to all admins
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        return admins.map((admin) => admin.id);
      } else if (context?.agentId) {
        // Profile updates for specific agent
        return [context.agentId];
      }
      break;

    case 'COMMISSION':
      if (context?.adminAction) {
        // Commission approvals go to all admins
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        return admins.map((admin) => admin.id);
      } else if (context?.agentId) {
        // Commission earned notifications for specific agent
        return [context.agentId];
      }
      break;

    case 'ASSET':
      if (context?.systemWide) {
        // New properties available to all agents
        const agents = await prisma.user.findMany({
          where: { role: 'AGENT', approvalStatus: 'APPROVED' },
          select: { id: true },
        });
        return agents.map((agent) => agent.id);
      } else if (context?.adminAction) {
        // Asset management notifications to admins
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        return admins.map((admin) => admin.id);
      }
      break;

    case 'SYSTEM':
      if (context?.systemWide) {
        // System-wide notifications to everyone
        const allUsers = await prisma.user.findMany({
          select: { id: true },
        });
        return allUsers.map((user) => user.id);
      } else if (context?.adminAction) {
        // System admin notifications
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        return admins.map((admin) => admin.id);
      }
      break;
  }

  // Fallback: if userId is provided, use it
  if (userId) {
    return [userId];
  }

  // Default fallback: send to all admins for safety
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });
  return admins.map((admin) => admin.id);
}

export async function sendSmartNotification(params: SendNotificationParams) {
  try {
    const targetUserIds = await determineTargetUsers(params);

    if (targetUserIds.length === 0) {
      throw new Error('No target users found for notification');
    }

    // If single user, use single notification endpoint
    if (targetUserIds.length === 1) {
      const response = await fetch(
        `${process.env.API_BASE_URL || ''}/api/notifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: targetUserIds[0],
            title: params.title,
            body: params.body,
            type: params.type || 'SYSTEM',
            link: params.link,
            data: {
              ...params.data,
              smartTargeting: true,
              targetAudience: params.targetAudience,
              context: params.context,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send notification');
      }

      return await response.json();
    } else {
      // Multiple users, use broadcast endpoint
      const response = await fetch(
        `${process.env.API_BASE_URL || ''}/api/notifications`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: targetUserIds,
            title: params.title,
            body: params.body,
            type: params.type || 'SYSTEM',
            link: params.link,
            data: {
              ...params.data,
              smartTargeting: true,
              targetAudience: params.targetAudience,
              context: params.context,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to broadcast notification');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error sending smart notification:', error);
    throw error;
  }
}

export async function sendNotification(params: SendNotificationParams) {
  return sendSmartNotification(params);
}

export async function broadcastNotification(
  params: BroadcastNotificationParams
) {
  try {
    let targetUserIds: string[] = [];

    if (params.userIds) {
      targetUserIds = params.userIds;
    } else {
      // Determine target users based on audience
      switch (params.targetAudience) {
        case 'ALL_ADMINS':
          const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
          });
          targetUserIds = admins.map((admin) => admin.id);
          break;

        case 'ALL_AGENTS':
          const agents = await prisma.user.findMany({
            where: { role: 'AGENT', approvalStatus: 'APPROVED' },
            select: { id: true },
          });
          targetUserIds = agents.map((agent) => agent.id);
          break;

        default:
          throw new Error('Invalid target audience or userIds not provided');
      }
    }

    const response = await fetch(
      `${process.env.API_BASE_URL || ''}/api/notifications`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: targetUserIds,
          title: params.title,
          body: params.body,
          type: params.type || 'SYSTEM',
          link: params.link,
          data: params.data,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to broadcast notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
}

// Direct database operations (for use in API routes)
import prisma from '@/lib/prisma';

export async function createSmartNotification(params: SendNotificationParams) {
  try {
    const targetUserIds = await determineTargetUsers(params);

    if (targetUserIds.length === 0) {
      throw new Error('No target users found for notification');
    }

    const notifications = await prisma.notification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        title: params.title,
        body: params.body,
        type: params.type || 'SYSTEM',
        link: params.link,
        data: {
          ...params.data,
          smartTargeting: true,
          targetAudience: params.targetAudience,
          context: params.context,
        },
      })),
    });

    return {
      count: notifications.count,
      targetUserIds,
      message: `Created ${notifications.count} notifications for ${targetUserIds.length} users`,
    };
  } catch (error) {
    console.error('Error creating smart notification:', error);
    throw error;
  }
}

export async function createNotification(params: SendNotificationParams) {
  return createSmartNotification(params);
}

export async function createBulkNotifications(
  params: BroadcastNotificationParams
) {
  try {
    let targetUserIds: string[] = [];

    if (params.userIds) {
      targetUserIds = params.userIds;
    } else {
      // Determine target users based on audience
      switch (params.targetAudience) {
        case 'ALL_ADMINS':
          const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
          });
          targetUserIds = admins.map((admin) => admin.id);
          break;

        case 'ALL_AGENTS':
          const agents = await prisma.user.findMany({
            where: { role: 'AGENT', approvalStatus: 'APPROVED' },
            select: { id: true },
          });
          targetUserIds = agents.map((agent) => agent.id);
          break;

        default:
          throw new Error('Invalid target audience or userIds not provided');
      }
    }

    const notifications = await prisma.notification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        title: params.title,
        body: params.body,
        type: params.type || 'SYSTEM',
        link: params.link,
        data: params.data,
      })),
    });

    return notifications;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
}

// Convenience functions for common notification scenarios

export async function notifyAgentReservationConfirmed(
  agentId: string,
  propertyTitle: string,
  reservationId: string
) {
  return createSmartNotification({
    title: 'Reservation Confirmed',
    body: `Your reservation for "${propertyTitle}" has been confirmed by admin.`,
    type: 'RESERVATION',
    link: `/reservations/${reservationId}`,
    targetAudience: 'SPECIFIC_USER',
    userId: agentId,
    context: { agentId },
    data: { reservationId, propertyTitle, status: 'CONFIRMED' },
  });
}

export async function notifyAdminsNewReservation(
  agentName: string,
  propertyTitle: string,
  reservationId: string
) {
  return createSmartNotification({
    title: 'New Property Reservation',
    body: `${agentName} has made a reservation for "${propertyTitle}". Please review and confirm.`,
    type: 'RESERVATION',
    link: `/admin/reservations/${reservationId}`,
    targetAudience: 'ALL_ADMINS',
    context: { adminAction: true },
    data: { reservationId, propertyTitle, agentName },
  });
}

export async function notifyAdminsNewAgentRegistration(
  agentName: string,
  agentEmail: string,
  agentId: string
) {
  return createSmartNotification({
    title: 'New Agent Registration',
    body: `${agentName} (${agentEmail}) has registered and is pending approval.`,
    type: 'PROFILE',
    link: `/admin/users/${agentId}`,
    targetAudience: 'ALL_ADMINS',
    context: { adminAction: true },
    data: { agentId, agentName, agentEmail, status: 'PENDING' },
  });
}

export async function notifyAgentApproved(agentId: string, agentName: string) {
  return createSmartNotification({
    title: 'Account Approved',
    body: `Congratulations ${agentName}! Your agent account has been approved. You can now start making reservations.`,
    type: 'PROFILE',
    link: '/dashboard',
    targetAudience: 'SPECIFIC_USER',
    userId: agentId,
    context: { agentId },
    data: { status: 'APPROVED' },
  });
}

export async function notifyAllAgentsNewProperty(
  propertyTitle: string,
  propertyId: string
) {
  return createSmartNotification({
    title: 'New Property Available',
    body: `A new property "${propertyTitle}" is now available for reservation.`,
    type: 'ASSET',
    link: `/properties/${propertyId}`,
    targetAudience: 'ALL_ADMINS', // This will be handled by smart targeting to go to agents
    context: { systemWide: true },
    data: { propertyId, propertyTitle },
  });
}

export async function notifyAdminsSystemAlert(
  title: string,
  message: string,
  link?: string
) {
  return createSmartNotification({
    title,
    body: message,
    type: 'SYSTEM',
    link: link || '/admin',
    targetAudience: 'ALL_ADMINS',
    context: { adminAction: true },
    data: { systemAlert: true },
  });
}

// Example usage in API routes:
/*
import { 
  notifyAgentReservationConfirmed,
  notifyAdminsNewReservation,
  notifyAdminsNewAgentRegistration,
  notifyAgentApproved,
  notifyAllAgentsNewProperty,
  notifyAdminsSystemAlert
} from '@/lib/notification-service-new';

// When a reservation is created
await notifyAdminsNewReservation(agentName, propertyTitle, reservationId);

// When admin confirms a reservation
await notifyAgentReservationConfirmed(agentId, propertyTitle, reservationId);

// When a new agent registers
await notifyAdminsNewAgentRegistration(agentName, agentEmail, agentId);

// When admin approves an agent
await notifyAgentApproved(agentId, agentName);

// When a new property is added
await notifyAllAgentsNewProperty(propertyTitle, propertyId);

// System alerts for admins
await notifyAdminsSystemAlert('System Maintenance', 'Scheduled maintenance tonight at 2 AM');
*/
