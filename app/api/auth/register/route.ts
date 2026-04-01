import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';
import { sendEmail } from '@/lib/email';
import { notifyAdminsNewAgentRegistration } from '@/lib/notification-service-new';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString().toLowerCase().trim();
    const password = body?.password?.toString();
    const name = body?.name?.toString().trim();
    const phone = body?.phone?.toString().trim();
    const governmentIdUrl = body?.governmentIdUrl?.toString().trim();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!governmentIdUrl) {
      return NextResponse.json(
        { error: 'Government ID is required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            'An account with this email already exists. Please try logging in instead.',
        },
        { status: 409 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with APPROVED status (auto-approval)
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: 'AGENT',
          approvalStatus: 'APPROVED',
          governmentIdUrl,
        },
      });

      // Generate numeric OTP (6 digits)
      const otp = randomInt(100000, 999999);
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: otp.toString(),
          otp,
          expires,
          type: 'OTP',
        },
      });

      return { user, otp };
    });

    // Send OTP email (outside transaction to avoid rollback on email failure)
    try {
      await sendEmail.verifyEmail(email, result.otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the registration if email sending fails
      // User can request a new OTP later
    }

    // Notify all admins about new agent registration
    try {
      await notifyAdminsNewAgentRegistration(
        result.user.name || result.user.email,
        result.user.email,
        result.user.id
      );
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail registration if notification fails
    }

    return NextResponse.json(
      {
        id: result.user.id,
        email: result.user.email,
        message:
          'Account created successfully. Please check your email for the verification code.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          'We encountered an issue creating your account. Please try again.',
      },
      { status: 500 }
    );
  }
}
