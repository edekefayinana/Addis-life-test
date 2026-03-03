import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }

    const body = await req.json();
    const { name } = body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendResponse({ error: 'Invalid name' }, 0, undefined, 400);
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true,
        image: true,
        phone: true,
      },
    });

    return sendResponse(updatedUser, 1);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true,
        image: true,
        phone: true,
      },
    });

    if (!user) {
      return sendResponse({ error: 'User not found' }, 0, undefined, 404);
    }

    return sendResponse(user, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
