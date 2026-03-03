import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError, sendResponse } from '@/lib/error-handler';

// Get single Project
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { properties: true },
    });
    if (!project)
      return sendResponse({ error: 'Not found' }, 0, undefined, 404);
    return sendResponse(project, 1);
  } catch (error) {
    return handleApiError(error);
  }
}

// Update Project
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name } = await req.json();
    const project = await prisma.project.update({
      where: { id },
      data: { name },
    });
    return sendResponse(project, 1);
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete Project
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return sendResponse({ success: true }, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
