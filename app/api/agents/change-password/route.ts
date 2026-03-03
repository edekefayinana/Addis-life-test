import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return sendResponse({ error: 'Unauthorized' }, 0, undefined, 401);
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return sendResponse({ error: 'Missing fields' }, 0, undefined, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true },
    });
    if (!user || !user.password) {
      return sendResponse(
        { error: 'User not found or password not set' },
        0,
        undefined,
        404
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return sendResponse(
        { error: 'Current password is incorrect' },
        0,
        undefined,
        400
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashed },
    });

    return sendResponse({ success: true }, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
