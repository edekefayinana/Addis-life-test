import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError, sendResponse } from '@/lib/error-handler';

// Create Project
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name)
      return sendResponse({ error: 'Name is required' }, 0, undefined, 400);
    const project = await prisma.project.create({ data: { name } });
    return sendResponse(project, 1, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// Get all Projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendResponse(projects, projects.length);
  } catch (error) {
    return handleApiError(error);
  }
}
