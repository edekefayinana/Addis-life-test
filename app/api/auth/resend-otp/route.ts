import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified.' },
        { status: 400 }
      );
    }

    // Delete any existing OTP tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email.toLowerCase().trim(),
        type: 'OTP',
      },
    });

    // Generate new OTP
    const otp = randomInt(100000, 999999);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase().trim(),
        token: otp.toString(),
        otp,
        expires,
        type: 'OTP',
      },
    });

    // Send OTP email
    try {
      await sendEmail.verifyEmail(email, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP has been resent to your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to resend OTP. Please try again.' },
      { status: 500 }
    );
  }
}
