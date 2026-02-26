import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireUser } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';

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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { message: 'Error fetching user' },
      { status: 500 }
    );
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

    // Destructure and prepare nested updates for relations
    const { name, phone } = body;

    const updated = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
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

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
