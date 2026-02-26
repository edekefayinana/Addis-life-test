import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with that email.' },
        { status: 404 }
      );
    }
    // Generate numeric OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp.toString(),
        otp,
        expires,
        type: 'PASSWORD_RESET',
      },
    });
    await sendEmail.passwordReset(email, otp);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send reset code.' },
      { status: 500 }
    );
  }
}
