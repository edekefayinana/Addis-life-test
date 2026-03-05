import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  generateAdminNotificationEmail,
  generateUserConfirmationEmail,
} from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema for contact form
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    const { firstName, lastName } = validatedData;

    // Send email to admin/support team
    const adminEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Addis Life <noreply@addislife.com>',
      to: process.env.CONTACT_EMAIL || 'fekedeananiya@gmail.com',
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: generateAdminNotificationEmail(validatedData),
    });

    // Send confirmation email to the user
    const userEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Addis Life <noreply@addislife.com>',
      to: validatedData.email,
      subject: 'Thank you for contacting Addis Life',
      html: generateUserConfirmationEmail(validatedData),
    });

    console.log('Admin email result:', adminEmailResult);
    console.log('User email result:', userEmailResult);

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully',
        adminEmailId: adminEmailResult.data?.id,
        userEmailId: userEmailResult.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
