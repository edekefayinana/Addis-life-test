import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

import { PrismaApiFeatures } from '@/lib/apiFeatures';
import { requireAdmin } from '@/lib/auth-guard';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) return authResult.error;

    const config = {
      allowedFields: ['role', 'approvalStatus', 'city'],
      searchFields: ['name', 'email'],
      defaultSort: { field: 'createdAt', order: 'desc' as 'desc' | 'asc' },
    };

    const features = new PrismaApiFeatures(
      Object.fromEntries(req.nextUrl.searchParams),
      config
    )
      .filter()
      .sort()
      .paginate()
      .search();

    // Run query and total count in parallel for better performance
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        ...features.build(),
        include: { _count: { select: { properties: true } } },
      }),
      prisma.user.count({ where: features.build().where }),
    ]);

    type UserWithCount = (typeof users)[number] & {
      _count?: { properties: number };
    };
    const formattedUsers = (users as UserWithCount[]).map((u) => ({
      ...u,
      propertyCount: u._count?.properties ?? 0,
    }));

    return sendResponse(
      formattedUsers,
      formattedUsers.length,
      features.getMeta(totalCount)
    );
  } catch (error) {
    return handleApiError(error);
  }
}
