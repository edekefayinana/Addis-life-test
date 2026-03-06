/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return sendResponse({ error: 'Unauthorized' }, 0, 401);
    }

    const totalUnits = await prisma.property.count();
    const totalProjects = await prisma.project.count();

    let totalReservations: number;
    if (session.user.role === 'ADMIN') {
      totalReservations = await prisma.reservation.count();
    } else {
      totalReservations = await prisma.reservation.count({
        where: { userId: session.user.id },
      });
    }

    const responseData: any = {
      totalUnits,
      totalReservations,
      totalProjects,
    };

    // Only include user count for admins
    if (session.user.role === 'ADMIN') {
      const totalUsers = await prisma.user.count();
      responseData.totalUsers = totalUsers;
    }

    return sendResponse(responseData, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
