import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function POST(request: Request) {
  try {
    const { email, otp, type = 'OTP' } = await request.json();
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    // Find the OTP token
    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        otp: Number(otp),
        type,
        expires: { gt: new Date() },
      },
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP.' },
        { status: 401 }
      );
    }

    // Only mark user as verified for email verification
    if (type === 'OTP') {
      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });
    }

    // Delete the token after use
    if (type !== 'PASSWORD_RESET') {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: token.token } },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to verify OTP.' },
      { status: 500 }
    );
  }
}
