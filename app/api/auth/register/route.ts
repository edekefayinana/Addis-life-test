import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString().toLowerCase().trim();
    const password = body?.password?.toString();
    const name = body?.name?.toString().trim();
    const phone = body?.phone?.toString().trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role: AGENT, approvalStatus: PENDING
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        role: 'AGENT',
        approvalStatus: 'PENDING',
        // TODO: Consider adding emailVerified field and set to null or false until OTP verification is done
        emailVerified: new Date(),
      },
    });

    // Generate numeric OTP (6 digits)
    const otp = randomInt(100000, 999999);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp.toString(),
        otp,
        expires,
        type: 'OTP',
      },
    });

    // Send OTP to user's email
    await sendEmail.verifyEmail(email, otp);

    return NextResponse.json(
      { id: user.id, email: user.email, otp },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to create account.' },
      { status: 500 }
    );
  }
}
