import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
    }

    // Find the OTP token for password reset
    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        otp: Number(otp),
        type: 'PASSWORD_RESET',
        expires: { gt: new Date() },
      },
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the token after use
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: token.token } },
    });

    return NextResponse.json({ message: 'Password reset successful.' });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
