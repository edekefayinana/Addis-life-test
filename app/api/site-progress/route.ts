import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - List all site progress (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const includeAll = searchParams.get('includeAll') === 'true';

    const where: {
      publishedAt?: { not: null };
      projectId?: string;
      status?: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
    } = {};

    // Only filter by publishedAt if not admin request
    if (!includeAll) {
      where.publishedAt = { not: null };
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (
      status &&
      (status === 'DRAFT' || status === 'IN_PROGRESS' || status === 'COMPLETED')
    ) {
      where.status = status;
    }

    const progress = await prisma.siteProgress.findMany({
      where,
      include: {
        project: true,
        media: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: includeAll
        ? { createdAt: 'desc' }
        : [{ publishedAt: 'desc' }, { order: 'asc' }],
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching site progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site progress' },
      { status: 500 }
    );
  }
}

// POST - Create new site progress (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, projectId, status, media, publishedAt } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Title and projectId are required' },
        { status: 400 }
      );
    }

    const progress = await prisma.siteProgress.create({
      data: {
        title,
        description,
        projectId,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        media: {
          create:
            media?.map(
              (
                m: {
                  url: string;
                  type: string;
                  thumbnailUrl?: string;
                  caption?: string;
                },
                index: number
              ) => ({
                url: m.url,
                type: m.type,
                thumbnailUrl: m.thumbnailUrl,
                caption: m.caption,
                order: index,
              })
            ) || [],
        },
      },
      include: {
        project: true,
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error('Error creating site progress:', error);
    return NextResponse.json(
      { error: 'Failed to create site progress' },
      { status: 500 }
    );
  }
}
