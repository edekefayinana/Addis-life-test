import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const agent = await prisma.user.update({
      where: { id: id },
      data: { approvalStatus: approvalStatus },
    });
    return NextResponse.json({ success: true, agent });
  } catch {
    return NextResponse.json(
      { message: 'Agent not found or update failed' },
      { status: 404 }
    );
  }
}
