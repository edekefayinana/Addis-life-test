import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Create Project
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    const project = await prisma.project.create({ data: { name } });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Get all Projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
