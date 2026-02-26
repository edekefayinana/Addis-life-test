/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let activities: any[] = [];

    // Reservation activities (confirmed, reserved)
    let reservations: Array<any> = [];
    if (session?.user?.role === 'ADMIN') {
      reservations = await prisma.reservation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: true, property: { include: { project: true } } },
      });
    } else if (session?.user?.id) {
      reservations = await prisma.reservation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: true, property: { include: { project: true } } },
      });
    }

    activities = reservations?.map((r) => {
      const projectName = r.property?.project?.name || '';
      let type = '';
      let title = '';
      let description = '';
      let activityTime = r.createdAt;
      switch (r.status) {
        case 'CONFIRMED':
          type = title = 'Reservation Confirmed';
          description = `Reservation for ${projectName} - ${r.property?.title || ''} was confirmed.`;
          activityTime = r.confirmedAt || r.createdAt;
          break;
        case 'PENDDING':
          type = title = 'Reservation Pending';
          description = `Reservation for ${projectName} - ${r.property?.title || ''} is pending approval.`;
          activityTime = r.createdAt;
          break;
        case 'CANCELLED':
          type = title = 'Reservation Cancelled';
          description = `Reservation for ${projectName} - ${r.property?.title || ''} was cancelled.`;
          activityTime = r.cancelledAt || r.createdAt;
          break;
        case 'EXPIRED':
          type = title = 'Reservation Expired';
          description = `Reservation for ${projectName} - ${r.property?.title || ''} has expired.`;
          activityTime = r.expiresAt || r.createdAt;
          break;
        case 'SELLED':
          type = title = 'Unit Sold';
          description = `Unit ${r.property?.title || ''} in ${projectName} has been sold.`;
          activityTime = r.createdAt;
          break;
        default:
          type = title = 'Reservation Activity';
          description = `Reservation for ${projectName} - ${r.property?.title || ''}.`;
          activityTime = r.createdAt;
      }
      return {
        type,
        title,
        description,
        createdAt: activityTime,
      };
    });

    // Sort by createdAt desc
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit to 3 most recent activities
    activities = activities.slice(0, 3);

    // Mock commission activity for demo (if any activity exists)
    if (activities.length > 0) {
      activities.unshift({
        type: 'Commission Approved',
        title: 'Commission Approved',
        description: `Commission for ${activities[0].description.replace('Reservation for ', '').replace(' was confirmed.', '').replace(' is pending approval.', '').replace(' was cancelled.', '').replace(' has expired.', '').replace(' has been sold.', '')} has been approved.`,
        createdAt: new Date(),
      });
      // Limit to 3 again (commission + 2 activities)
      activities = activities.slice(0, 3);
    }

    return NextResponse.json({ activities });
  } catch {
    return NextResponse.json(
      { error: 'Unable to fetch activities.' },
      { status: 500 }
    );
  }
}
