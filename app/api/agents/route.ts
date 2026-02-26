import { PrismaApiFeatures, PrismaApiFeaturesConfig } from '@/lib/apiFeatures';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Role = 'AGENT' | 'ADMIN' | 'USER';
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }
    const config: PrismaApiFeaturesConfig = {
      allowedFields: ['propertyType', 'currentStatus', 'city'],
      searchFields: ['title'],
      defaultSort: { field: 'createdAt', order: 'desc' },
    } as const;

    const features = new PrismaApiFeatures(
      Object.fromEntries(req.nextUrl.searchParams),
      config
    )
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search();

    const users = (await prisma.user.findMany({
      ...features.build(),
      include: {
        _count: {
          select: { properties: true },
        },
      },
    })) as Array<{
      createdAt: Date;
      id: string;
      name: string | null;
      email: string;
      phone: string | null;
      emailVerified: Date | null;
      image: string | null;
      password: string;
      role: Role;
      approvalStatus: ApprovalStatus;
      updatedAt: Date;
      _count: { properties: number };
    }>;

    // Attach propertyCount to each user for easier frontend use
    const usersWithCount = users.map((u) => ({
      ...u,
      propertyCount: u._count?.properties ?? 0,
    }));

    return NextResponse.json({
      status: 'success',
      results: usersWithCount.length,
      data: usersWithCount,
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
