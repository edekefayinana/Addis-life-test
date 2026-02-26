import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    const totalUsers = await prisma.user.count();
    return NextResponse.json({
      totalUnits,
      totalReservations,
      totalUsers,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to fetch stats.' },
      { status: 500 }
    );
  }
}
