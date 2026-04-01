/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

class SendEmail {
  private resend: Resend | null = null;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ MISSING: RESEND_API_KEY environment variable.');
      } else {
        this.resend = new Resend(process.env.RESEND_API_KEY);
      }
    }
  }

  async send(to: string, subject: string, html: string) {
    const isProd = process.env.NODE_ENV === 'production';
    console.log(
      `[EmailService] Sending to: ${to} | Mode: ${process.env.NODE_ENV}`
    );

    try {
      if (isProd && this.resend) {
        return await this.sendViaResend(to, subject, html);
      } else {
        return await this.sendViaNodemailer(to, subject, html);
      }
    } catch (error: any) {
      console.error(`❌ Email delivery failed: ${error.message}`);
      throw error;
    }
  }

  private async sendViaResend(to: string, subject: string, html: string) {
    const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev';

    const { data, error } = await this.resend!.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Resend: Email sent successfully!', data?.id);
    return data;
  }

  private async sendViaNodemailer(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log(`✅ Nodemailer: Email sent. Message ID: ${info.messageId}`);
    return info;
  }

  // --- Email Templates ---

  async verifyEmail(email: string, otp: number) {
    const subject = 'Verify your email address';
    const html = `<p>Your verification code is: <b>${otp}</b></p>`;
    await this.send(email, subject, html);
  }

  async passwordReset(email: string, otp: number) {
    const subject = 'Password Reset Request';
    const html = `<p>Your password reset code is: <b>${otp}</b></p>`;
    await this.send(email, subject, html);
  }
}

export const sendEmail = new SendEmail();

// import { Resend } from 'resend';
// import nodemailer from 'nodemailer';

// class SendEmail {
//   private resend: Resend | null = null;

//   constructor() {
//     if (process.env.NODE_ENV === 'production') {
//       if (!process.env.RESEND_API_KEY) {
//         console.error("❌ MISSING: RESEND_API_KEY environment variable.");
//       } else {
//         this.resend = new Resend(process.env.RESEND_API_KEY);
//       }
//     }
//   }

//   async send(to: string, subject: string, html: string) {
//     const isProd = process.env.NODE_ENV === 'production';
//     console.log(`[EmailService] Sending to: ${to} | Mode: ${process.env.NODE_ENV}`);

//     try {
//       if (isProd && this.resend) {
//         return await this.sendViaResend(to, subject, html);
//       } else {
//         return await this.sendViaNodemailer(to, subject, html);
//       }
//     } catch (error: any) {
//       console.error(`❌ Email delivery failed: ${error.message}`);
//       throw error;
//     }
//   }

//   private async sendViaResend(to: string, subject: string, html: string) {
//     // Note: Resend requires a verified domain or 'onboarding@resend.dev' for testing
//     const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev';

//     const { data, error } = await this.resend!.emails.send({
//       from: fromAddress,
//       to: [to], // Resend accepts an array or string
//       subject,
//       html,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     console.log("✅ Resend: Email sent successfully!", data?.id);
//     return data;
//   }

//   private async sendViaNodemailer(to: string, subject: string, html: string) {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT) || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.SMTP_FROM || process.env.SMTP_USER,
//       to,
//       subject,
//       html,
//     });

//     console.log(`✅ Nodemailer: Email sent. Message ID: ${info.messageId}`);
//     return info;
//   }

//   // --- Methods for specific emails ---

//   async verifyEmail(email: string, otp: number) {
//     const subject = 'Verify your email address';
//     const html = `<p>Your verification code is: <b>${otp}</b></p>`;
//     await this.send(email, subject, html);
//   }

//   async passwordReset(email: string, otp: number) {
//     const subject = 'Password Reset Request';
//     const html = `<p>Your password reset code is: <b>${otp}</b></p>`;
//     await this.send(email, subject, html);
//   }
// }

// export const sendEmail = new SendEmail();
