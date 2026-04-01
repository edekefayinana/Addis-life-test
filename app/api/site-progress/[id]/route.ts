import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Get single site progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const progress = await prisma.siteProgress.findUnique({
      where: { id },
      include: {
        project: true,
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Site progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching site progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site progress' },
      { status: 500 }
    );
  }
}

// PUT - Update site progress (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, media, publishedAt } = body;

    // Delete existing media and recreate
    await prisma.progressMedia.deleteMany({
      where: { siteProgressId: id },
    });

    const progress = await prisma.siteProgress.update({
      where: { id },
      data: {
        title,
        description,
        status,
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

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating site progress:', error);
    return NextResponse.json(
      { error: 'Failed to update site progress' },
      { status: 500 }
    );
  }
}

// DELETE - Delete site progress (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.siteProgress.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site progress:', error);
    return NextResponse.json(
      { error: 'Failed to delete site progress' },
      { status: 500 }
    );
  }
}
