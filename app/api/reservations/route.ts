/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';
import { PrismaApiFeatures, PrismaApiFeaturesConfig } from '@/lib/apiFeatures';
import {
  notifyPropertyOwner,
  notifyReservationConfirmed,
  notifyReservationCancelled,
} from '@/lib/firebase-admin';

// GET /api/reservations - List reservations with filtering, sorting, and pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }

    const isAdmin = session.user.role === 'ADMIN';

    const config: PrismaApiFeaturesConfig = {
      allowedFields: ['status'],
      searchFields: [], // We'll handle search manually for related fields
      defaultSort: { field: 'createdAt', order: 'desc' },
    };

    const features = new PrismaApiFeatures(
      Object.fromEntries(req.nextUrl.searchParams),
      config
    )
      .filter()
      .sort()
      .paginate();

    // Build where clause
    const where: any = features.build().where || {};

    // Add role-based filtering
    if (!isAdmin) {
      where.userId = session.user.id;
    }

    // Handle search across related fields
    const searchParam = req.nextUrl.searchParams.get('search');
    if (searchParam) {
      where.OR = [
        { property: { title: { contains: searchParam, mode: 'insensitive' } } },
        {
          property: {
            project: { name: { contains: searchParam, mode: 'insensitive' } },
          },
        },
        { user: { name: { contains: searchParam, mode: 'insensitive' } } },
        { user: { email: { contains: searchParam, mode: 'insensitive' } } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.reservation.count({ where });

    // Fetch reservations
    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        property: {
          include: { project: true },
        },
        user: true,
      },
      orderBy: features.build().orderBy,
      skip: features.build().skip,
      take: features.build().take,
    });

    return sendResponse(
      reservations,
      reservations.length,
      features.getMeta(totalCount)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/reservations - Create a reservation/hold
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }
    // Only allow AGENT role with APPROVED status to create reservation
    if (session.user.role !== 'AGENT') {
      return sendResponse(
        { error: 'Only agents can create reservations' },
        0,
        undefined,
        403
      );
    }
    if (session.user.approvalStatus !== 'APPROVED') {
      return sendResponse(
        { error: 'Only approved agents can create reservations' },
        0,
        undefined,
        403
      );
    }
    const { propertyId, expiresInMinutes = 20 } = await req.json();
    if (!propertyId) {
      return sendResponse({ error: 'Missing propertyId' }, 0, undefined, 400);
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
      return sendResponse(
        { error: 'You already have a reservation for this property' },
        0,
        undefined,
        409
      );
    }

    // Check if property is already reserved (pending or confirmed and not expired)
    const existing = await prisma.reservation.findFirst({
      where: {
        propertyId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        expiresAt: { gt: now },
        cancelledAt: null,
      },
    });
    if (existing) {
      return sendResponse(
        { error: 'Property already reserved or PENDING' },
        0,
        undefined,
        409
      );
    }

    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60000);
    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        propertyId,
        expiresAt,
        status: 'PENDING',
      },
      include: {
        property: {
          include: {
            createdBy: true, // Get property owner
          },
        },
        user: true,
      },
    });

    // Send push notification to property owner
    try {
      await notifyPropertyOwner({
        ownerId: reservation.property.createdById,
        propertyTitle: reservation.property.title,
        reservationId: reservation.id,
        agentName: reservation.user.name || reservation.user.email,
      });
    } catch (e) {
      // Log but don't block reservation creation
      console.error('❌ Failed to send notification:', e);
    }

    return sendResponse(reservation, 1, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/reservations/:id - Confirm or cancel a reservation
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }
    const { id, action, reason } = await req.json();
    if (!id || !['CONFIRM', 'CANCEL'].includes(action)) {
      return sendResponse({ error: 'Invalid request' }, 0, undefined, 400);
    }
    const now = new Date();
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        property: true,
        user: true,
      },
    });
    if (!reservation) {
      return sendResponse({ error: 'Not found' }, 0, undefined, 404);
    }
    // AGENT can cancel their own, ADMIN can confirm/cancel any
    const isAdmin = session.user.role === 'ADMIN';
    if (!isAdmin && reservation.userId !== session.user.id) {
      return sendResponse({ error: 'Forbidden' }, 0, undefined, 403);
    }

    let data: any = {};
    if (action === 'CONFIRM') {
      data = { status: 'CONFIRMED', confirmedAt: now };
    } else if (action === 'CANCEL') {
      data = { status: 'CANCELLED', cancelledAt: now };
    }

    const updated = await prisma.reservation.update({ where: { id }, data });

    // Send notifications
    try {
      if (action === 'CONFIRM') {
        // Notify agent that reservation is confirmed
        await notifyReservationConfirmed({
          agentId: reservation.userId,
          propertyTitle: reservation.property.title,
          reservationId: reservation.id,
        });
      } else if (action === 'CANCEL') {
        // Notify the affected user about cancellation
        const notifyUserId = isAdmin
          ? reservation.userId
          : reservation.property.createdById;
        await notifyReservationCancelled({
          userId: notifyUserId,
          propertyTitle: reservation.property.title,
          reservationId: reservation.id,
          reason,
        });
      }
    } catch (e) {
      console.error('❌ Failed to send notification:', e);
    }

    return sendResponse(updated, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
