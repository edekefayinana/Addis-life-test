interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
}

export function generateAdminNotificationEmail(data: ContactFormData): string {
  const { firstName, lastName, email, phone, description } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #f4a905; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
      </div>
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">Message</h3>
        <p style="line-height: 1.6; color: #555;">${description.replace(/\n/g, '<br>')}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          This message was sent from the Addis Life contact form on ${new Date().toLocaleString()}.
        </p>
      </div>
    </div>
  `;
}

export function generateUserConfirmationEmail(data: ContactFormData): string {
  const { firstName, lastName, email, phone, description } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #f4a905; padding-bottom: 10px;">
        Thank You for Contacting Us!
      </h2>
      
      <p style="color: #555; line-height: 1.6;">
        Dear ${firstName},
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        Thank you for reaching out to Addis Life. We have received your message and our team will get back to you within 24-48 hours.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Your Message Summary</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #f4a905;">
          ${description.replace(/\n/g, '<br>')}
        </p>
      </div>
      
      <p style="color: #555; line-height: 1.6;">
        In the meantime, feel free to explore our properties and services on our website.
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
