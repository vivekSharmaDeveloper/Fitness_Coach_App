import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import { 
  getWelcomeEmailTemplate, 
  getForgotPasswordEmailTemplate, 
  getPasswordResetConfirmationTemplate 
} from './email-templates';

// Configure the SMTP transporter
function createTransporter() {
  // Fallback to console logging in development if SMTP is not configured
  if (!process.env.SMTP_HOST && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ SMTP not configured, emails will be logged to console');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const transporter = createTransporter();

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  variables?: Record<string, any>;
}

export async function sendEmail({ to, subject, template, variables = {} }: SendEmailOptions) {
  try {
    // Convert MJML template to HTML
    const { html } = mjml2html(template);

    if (!transporter) {
      // Development fallback - log email to console
      console.log('📧 Email would be sent to:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 HTML Content:', html.substring(0, 200) + '...');
      return { success: true, messageId: 'dev-mode' };
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || 'noreply@fitnesscoach.com',
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// Welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login`;
  const { subject, template } = getWelcomeEmailTemplate(name, loginUrl);
  
  return sendEmail({
    to,
    subject,
    template,
  });
}

// Forgot password email
export async function sendForgotPasswordEmail(to: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  const expirationTime = '1 hour';
  const { subject, template } = getForgotPasswordEmailTemplate(name, resetUrl, expirationTime);
  
  return sendEmail({
    to,
    subject,
    template,
  });
}

// Password reset confirmation email
export async function sendPasswordResetConfirmationEmail(to: string, name: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login`;
  const { subject, template } = getPasswordResetConfirmationTemplate(name, loginUrl);
  
  return sendEmail({
    to,
    subject,
    template,
  });
}

// Test email connectivity
export async function testEmailConnection() {
  if (!transporter) {
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

