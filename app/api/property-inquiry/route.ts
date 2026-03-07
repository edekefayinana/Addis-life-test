import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema for property inquiry form
const propertyInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  type: z.string().default('property_inquiry'),
});

interface PropertyInquiryData {
  name: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  type: string;
}

function generatePropertyInquiryAdminEmail(data: PropertyInquiryData): string {
  const { name, email, message, propertyTitle, propertyId } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #f4a905; padding-bottom: 10px;">
        New Property Inquiry
      </h2>
      
      ${
        propertyTitle
          ? `
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Property Details</h3>
        <p><strong>Property:</strong> ${propertyTitle}</p>
        ${propertyId ? `<p><strong>Property ID:</strong> ${propertyId}</p>` : ''}
        ${propertyId ? `<p><strong>Property Link:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties/${propertyId}" style="color: #f4a905; text-decoration: none;">View Property</a></p>` : ''}
      </div>
      `
          : ''
      }
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      </div>
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">Message</h3>
        <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          This inquiry was sent from the Addis Life property page on ${new Date().toLocaleString()}.
        </p>
      </div>
    </div>
  `;
}

function generatePropertyInquiryUserEmail(data: PropertyInquiryData): string {
  const { name, email, message, propertyTitle, propertyId } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #f4a905; padding-bottom: 10px;">
        Thank You for Your Property Inquiry!
      </h2>
      
      <p style="color: #555; line-height: 1.6;">
        Dear ${name},
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        Thank you for your interest in ${propertyTitle ? `"${propertyTitle}"` : 'our property'}. We have received your inquiry and our team will get back to you within 24-48 hours with detailed information.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Your Inquiry Summary</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${propertyTitle ? `<p><strong>Property:</strong> ${propertyTitle}</p>` : ''}
        ${propertyId ? `<p><strong>View Property:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties/${propertyId}" style="color: #f4a905; text-decoration: none;">Click here to view property details</a></p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="background-color: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #f4a905;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </div>
      
      <p style="color: #555; line-height: 1.6;">
        Our property specialists will review your inquiry and provide you with comprehensive details about the property, including availability, pricing, and scheduling a viewing if you're interested.
      </p>
      
      <div style="margin-top: 30px; padding: 20px; background-color: #f4a905; border-radius: 8px; text-align: center;">
        <h3 style="color: white; margin: 0 0 10px 0;">Addis Life</h3>
        <p style="color: white; margin: 0; font-size: 14px;">
          Your trusted partner in finding the perfect property
        </p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
        <p style="margin: 0; color: #666; font-size: 12px; text-align: center;">
          This is an automated confirmation email. Please do not reply to this email.
          <br>
          If you need immediate assistance, please call us directly.
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = propertyInquirySchema.parse(body);

    const { name, email, propertyTitle } = validatedData;

    // Send email to admin/support team
    const adminEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Addis Life <noreply@addislife.com>',
      to: process.env.CONTACT_EMAIL || 'fekedeananiya@gmail.com',
      subject: `New Property Inquiry from ${name}${propertyTitle ? ` - ${propertyTitle}` : ''}`,
      html: generatePropertyInquiryAdminEmail(validatedData),
    });

    // Send confirmation email to the user
    const userEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Addis Life <noreply@addislife.com>',
      to: email,
      subject: `Thank you for your property inquiry${propertyTitle ? ` - ${propertyTitle}` : ''}`,
      html: generatePropertyInquiryUserEmail(validatedData),
    });

    return NextResponse.json(
      {
        message: 'Property inquiry submitted successfully',
        adminEmailId: adminEmailResult.data?.id,
        userEmailId: userEmailResult.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Property inquiry submission error:', error);

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
      { message: 'Failed to send inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
