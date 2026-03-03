/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Prisma } from '../app/generated/prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);

  // 1. Prisma Specific Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const target = (error.meta?.target as string[])?.join(', ') || 'field';
        return NextResponse.json(
          { status: 'error', message: `Duplicate value for: ${target}` },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          { status: 'error', message: 'Record not found' },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          { status: 'error', message: 'Database operation failed' },
          { status: 400 }
        );
    }
  }

  // 2. Custom App Errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: error.statusCode }
    );
  }

  // 3. Fallback for unexpected errors
  return NextResponse.json(
    { status: 'error', message: 'Internal Server Error' },
    { status: 500 }
  );
};

export const sendResponse = (
  data: any,
  results?: number,
  meta?: any,
  status?: number
) => {
  return NextResponse.json(
    {
      status: 'success',
      results: results ?? (Array.isArray(data) ? data.length : undefined),
      meta,
      data,
    },
    { status: status ?? 200 }
  );
};
