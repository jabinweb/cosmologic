import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: '"Cosmologic Academy" <noreply@cosmologic.academy>',
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Welcome to Cosmologic Academy!</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    
    await transporter.sendMail({
      from: '"Cosmologic Learning" <noreply@cosmologic.edu>',
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Reset Your Password</h1>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="background-color: #6366f1; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; 
                    margin-top: 20px;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    logger.debug('Password reset email sent to:', email);
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
  }
}

export async function sendSubscriptionEmail(email: string, planId: string) {
  try {
    const info = await transporter.sendMail({
      from: '"Cosmologic Learning" <noreply@cosmologic.edu>',
      to: email,
      subject: "Welcome to Cosmologic! Your Subscription is Active",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to Cosmologic!</h1>
          <p>Your ${planId} subscription has been activated successfully.</p>
          <p>You now have access to:</p>
          <ul>
            <li>Interactive learning materials</li>
            <li>Live classes and workshops</li>
            <li>Community features</li>
            <li>Progress tracking</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background-color: #6366f1; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; 
                    margin-top: 20px;">
            Go to Dashboard
          </a>
        </div>
      `,
    });

    logger.debug('Subscription email sent:', info.messageId);
  } catch (error) {
    logger.error('Failed to send subscription email:', error);
  }
}
