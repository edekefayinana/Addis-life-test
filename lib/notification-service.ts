// Server-side notification service
// Use this in your API routes to send notifications

interface SendNotificationParams {
  userId: string;
  title: string;
  body: string;
  type?: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  link?: string;
  data?: Record<string, string>;
}

interface BroadcastNotificationParams {
  userIds: string[];
  title: string;
  body: string;
  type?: 'commission' | 'reservation' | 'asset' | 'system' | 'profile';
  link?: string;
  data?: Record<string, string>;
}

export async function sendNotification(params: SendNotificationParams) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/notifications/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

export async function broadcastNotification(
  params: BroadcastNotificationParams
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/notifications/send`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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

// Example usage in API routes:
/*
import { sendNotification } from '@/lib/notification-service';

// When a new reservation is created
await sendNotification({
  userId: agentId,
  title: 'New Reservation',
  body: `You have a new reservation for ${propertyTitle}`,
  type: 'reservation',
  link: `/admin/reservations/${reservationId}`,
  data: {
    reservationId,
    propertyId,
  },
});

// When commission is approved
await sendNotification({
  userId: agentId,
  title: 'Commission Approved',
  body: `Your commission of $${amount} has been approved`,
  type: 'commission',
  link: `/admin/commissions`,
});
*/
