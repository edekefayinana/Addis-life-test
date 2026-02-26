/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/reservations - Create a reservation/hold
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Only allow AGENT role to create reservation
  if (session.user.role !== 'AGENT') {
    return NextResponse.json(
      { error: 'Only agents can create reservations' },
      { status: 403 }
    );
  }
  const { propertyId, expiresInMinutes = 20 } = await req.json();
  if (!propertyId) {
    return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
  }

  // Check if this agent already has a reservation for this property (any status except CANCELLED/EXPIRED)
  const now = new Date();
  const agentExisting = await prisma.reservation.findFirst({
    where: {
      propertyId,
      userId: session.user.id,
      status: { notIn: ['CANCELLED', 'EXPIRED', 'SELLED'] },
    },
  });
  if (agentExisting) {
    return NextResponse.json(
      { error: 'You already have a reservation for this property' },
      { status: 409 }
    );
  }

  // Check if property is already reserved (pending or confirmed and not expired)
  const existing = await prisma.reservation.findFirst({
    where: {
      propertyId,
      status: { in: ['PENDDING', 'CONFIRMED'] },
      expiresAt: { gt: now },
      cancelledAt: null,
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'Property already reserved or PENDDING' },
      { status: 409 }
    );
  }

  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60000);
  const reservation = await prisma.reservation.create({
    data: {
      userId: session.user.id,
      propertyId,
      expiresAt,
      status: 'PENDDING',
    },
  });
  return NextResponse.json(reservation, { status: 201 });
}

// PATCH /api/reservations/:id - Confirm or cancel a reservation
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, action } = await req.json();
  if (!id || !['CONFIRM', 'CANCEL'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const now = new Date();
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  // AGENT can cancel their own, ADMIN can confirm/cancel any
  const isAdmin = session.user.role === 'ADMIN';
  if (!isAdmin && reservation.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // TODO: You can add additional checks here, e.g. only allow confirming if status is PENDDING, etc.
  // if (reservation.status !== 'PENDDING' || reservation.expiresAt < now) {
  //   return NextResponse.json({ error: 'Reservation not active' }, { status: 409 });
  // }
  let data: any = {};
  if (action === 'CONFIRM') {
    // TODO confirmedBy: session.user.id can be added if you want to track who confirmed
    data = { status: 'CONFIRMED', confirmedAt: now };
  } else if (action === 'CANCEL') {
    // TODO cancelledBy: session.user.id can be added if you want to track who cancelled
    data = { status: 'CANCELLED', cancelledAt: now };
  }
  const updated = await prisma.reservation.update({ where: { id }, data });
  return NextResponse.json(updated);
}

// GET /api/reservations?propertyId=... - List reservations for a property
// req: NextRequest
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // const { searchParams } = new URL(req.url);
  const isAdmin = session.user.role === 'ADMIN';
  const where: any = {};
  if (!isAdmin) {
    where.userId = session.user.id;
  }
  // Optionally filter by propertyId or other params here
  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      property: {
        include: { project: true },
      },
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reservations);
}
