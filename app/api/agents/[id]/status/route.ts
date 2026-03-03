import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }

    const { approvalStatus } = await req.json();
    if (!['PENDING', 'APPROVED'].includes(approvalStatus)) {
      return sendResponse({ error: 'Invalid status' }, 0, undefined, 400);
    }

    const agent = await prisma.user.update({
      where: { id: id },
      data: { approvalStatus: approvalStatus },
    });
    return sendResponse({ success: true, agent }, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
