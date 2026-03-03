import { NextRequest } from 'next/server';
import { requireAdmin, requireUser } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const property = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!property) {
      return sendResponse({ error: 'User not found' }, 0, undefined, 404);
    }

    return sendResponse(property, 1);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireUser();

    if (authResult.error) {
      return authResult.error;
    }

    const body = await req.json();
    const { name, phone } = body;

    const updated = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        phone,
      },
    });

    return sendResponse(updated, 1);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return sendResponse({ message: 'Deleted successfully' }, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
