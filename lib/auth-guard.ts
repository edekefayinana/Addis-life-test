import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { message: 'Forbidden: Admins only' },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      ),
    };
  }
  return { session };
}
