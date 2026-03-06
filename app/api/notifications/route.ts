/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleApiError, sendResponse } from '@/lib/error-handler';

// GET /api/notifications - Fetch user notifications
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (unreadOnly) {
      where.read = false;
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    // Fetch notifications with pagination
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/notifications - Create notification (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      userId,
      title,
      body: notificationBody,
      type = 'SYSTEM',
      link,
      data,
    } = body;

    if (!userId || !title || !notificationBody) {
      return NextResponse.json(
        { error: 'userId, title, and body are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        body: notificationBody,
        type: type.toUpperCase(),
        link,
        data,
      },
    });

    return sendResponse(notification, 1, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/notifications - Broadcast notification to multiple users (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      userIds,
      title,
      body: notificationBody,
      type = 'SYSTEM',
      link,
      data,
    } = body;

    if (
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0 ||
      !title ||
      !notificationBody
    ) {
      return NextResponse.json(
        { error: 'userIds (array), title, and body are required' },
        { status: 400 }
      );
    }

    // Verify users exist
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const existingUserIds = users.map((user) => user.id);
    const notFoundUserIds = userIds.filter(
      (id) => !existingUserIds.includes(id)
    );

    if (notFoundUserIds.length > 0) {
      return NextResponse.json(
        { error: `Users not found: ${notFoundUserIds.join(', ')}` },
        { status: 404 }
      );
    }

    // Create notifications for all users
    const notifications = await prisma.notification.createMany({
      data: existingUserIds.map((userId) => ({
        userId,
        title,
        body: notificationBody,
        type: type.toUpperCase(),
        link,
        data,
      })),
    });

    return sendResponse({
      message: `Successfully created ${notifications.count} notifications`,
      count: notifications.count,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
