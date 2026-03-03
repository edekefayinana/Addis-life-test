import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const totalUnits = await prisma.property.count();
    let totalReservations: number;
    if (session?.user?.role === 'ADMIN') {
      totalReservations = await prisma.reservation.count();
    } else if (session?.user?.id) {
      totalReservations = await prisma.reservation.count({
        where: { userId: session.user.id },
      });
    } else {
      totalReservations = 0;
    }
    const totalProjects = await prisma.project.count();
    const totalUsers = await prisma.user.count();
    return sendResponse(
      {
        totalUnits,
        totalReservations,
        totalUsers,
        totalProjects,
      },
      1
    );
  } catch (error) {
    return handleApiError(error);
  }
}
