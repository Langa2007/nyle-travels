import { Resend } from 'resend';
import dotenv from 'dotenv';
import { query } from '../config/db.js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  BOOKING_CONFIRMATION: 'booking-confirmation',
  BOOKING_CANCELLATION: 'booking-cancellation',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  REVIEW_REQUEST: 'review-request',
  NEWSLETTER: 'newsletter',
  NEWSLETTER_WELCOME: 'newsletter-welcome'
};

// Log email to database
const logEmail = async (userId, emailTo, subject, template, status, messageId, error = null) => {
  try {
    await query(
      `INSERT INTO email_logs (user_id, email_to, subject, template, status, resend_message_id, error_message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, emailTo, subject, template, status, messageId, error]
    );
  } catch (dbError) {
    console.error('Failed to log email:', dbError);
  }
};

// Send email function
export const sendEmail = async ({ to, subject, template, data, userId = null }) => {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: [to],
      subject: subject,
      html: generateEmailHtml(template, data),
    });

    if (error) {
      await logEmail(userId, to, subject, template, 'failed', null, error.message);
      throw error;
    }

    await logEmail(userId, to, subject, template, 'sent', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Generate HTML for emails
const generateEmailHtml = (template, data) => {
  switch (template) {
    case EMAIL_TEMPLATES.WELCOME:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Nyle Travel</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Nyle Travel & Tours</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px;">Hello <strong>${data.name}</strong>,</p>
            
            <p style="font-size: 16px;">Thank you for joining Nyle Travel & Tours! We're thrilled to have you as part of our community of luxury travelers.</p>
            
            <div style="background: white; border-radius: 8px; padding: 30px; margin: 30px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #667eea; margin-top: 0;">Your Journey Begins Here</h2>
              <p style="margin-bottom: 20px;">Start exploring our exclusive collection of luxury hotels and experiences across Kenya and beyond.</p>
              
              <a href="${data.dashboardUrl}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Explore Destinations →</a>
            </div>
            
            <div style="margin-top: 30px;">
              <h3 style="color: #333;">What you can do with Nyle Travel:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 15px 0; padding-left: 25px; position: relative;">✓ Book exclusive luxury stays</li>
                <li style="margin: 15px 0; padding-left: 25px; position: relative;">✓ Access premium accommodations</li>
                <li style="margin: 15px 0; padding-left: 25px; position: relative;">✓ Get personalized travel recommendations</li>
                <li style="margin: 15px 0; padding-left: 25px; position: relative;">✓ Earn loyalty points on every booking</li>
              </ul>
            </div>
            
            <div style="border-top: 2px solid #eee; margin-top: 40px; padding-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px;">Need help planning your perfect journey? Our luxury travel consultants are here for you 24/7.</p>
              <p style="margin-top: 20px;">
                <a href="mailto:concierge@nyletravel.com" style="color: #667eea; text-decoration: none;">concierge@nyletravel.com</a> | 
                <a href="tel:+254700000000" style="color: #667eea; text-decoration: none;">+254 700 000 000</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
              <p>© 2024 Nyle Travel & Tours. All rights reserved.</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
        </body>
        </html>
      `;


    case EMAIL_TEMPLATES.PASSWORD_RESET:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Nyle Travel</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Reset Your Password</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hello <strong>${data.name}</strong>,</p>
            
            <p>We received a request to reset your password for your Nyle Travel account. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${data.resetUrl}" style="display: inline-block; background: #f5576c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">This password reset link will expire in 1 hour for security reasons.</p>
            
            <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
            
            <div style="border-top: 2px solid #eee; margin-top: 40px; padding-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px;">For security, this request was made from IP: ${data.ipAddress}</p>
              <p style="color: #999; font-size: 12px;">Time: ${data.timestamp}</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // Add more templates as ne    case EMAIL_TEMPLATES.NEWSLETTER_WELCOME:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Nyle Travel Community</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">
          <div style="background: #1a1a1a; padding: 60px 20px; text-align: center;">
            <h1 style="color: #c5a059; margin: 0; font-size: 32px; font-family: serif; letter-spacing: 2px;">NYLE TRAVEL</h1>
            <p style="color: #999; margin-top: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 4px;">Luxury Stays & Experiences</p>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff;">
            <h2 style="color: #1a1a1a; font-family: serif; font-size: 24px; text-align: center; margin-bottom: 30px;">Welcome to the Inner Circle</h2>
            
            <p style="font-size: 16px; color: #444; margin-bottom: 20px;">
              Thank you for subscribing to the Nyle Travel newsletter. You are now part of an exclusive community of travelers who appreciate the finer details of African exploration.
            </p>
            
            <div style="background: #fdfaf4; border: 1px solid #f3e6d5; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
              <h3 style="color: #c5a059; margin-top: 0; font-family: serif;">Your Exclusive Benefit</h3>
              <p style="margin-bottom: 20px; font-size: 15px;">As a token of our appreciation, please enjoy an exclusive <strong>10% discount</strong> on your first luxury booking with us.</p>
              <div style="display: inline-block; border: 2px dashed #c5a059; color: #1a1a1a; padding: 15px 30px; font-size: 20px; font-weight: bold; font-family: monospace;">NYLEWELCOME10</div>
            </div>
            
            <p style="font-size: 16px; color: #444;">Moving forward, you'll be the first to receive:</p>
            <ul style="color: #666; font-size: 14px; margin-bottom: 30px;">
              <li style="margin-bottom: 10px;">Early access to limited-edition safari departures.</li>
              <li style="margin-bottom: 10px;">Insider guides to Africa's most secluded luxury lodges.</li>
              <li style="margin-bottom: 10px;">Invitations to exclusive member-only events.</li>
            </ul>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="${data.websiteUrl}" style="display: inline-block; background: #1a1a1a; color: #c5a059; padding: 18px 35px; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 2px;">Explore Destinations</a>
            </div>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 13px; margin-bottom: 20px;">Follow our journey through the wild</p>
            <div style="margin-bottom: 30px;">
              <a href="#" style="margin: 0 10px; color: #1a1a1a; text-decoration: none;">Instagram</a>
              <a href="#" style="margin: 0 10px; color: #1a1a1a; text-decoration: none;">Facebook</a>
            </div>
            <p style="color: #ccc; font-size: 11px;">You received this email because you subscribed on our website. <br> <a href="${data.unsubscribeUrl}" style="color: #999;">Unsubscribe</a></p>
          </div>
        </body>
        </html>
      `;

    default:
      return `<p>${JSON.stringify(data)}</p>`;

    case EMAIL_TEMPLATES.EMAIL_VERIFICATION:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Nyle Travel</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a1a; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #c5a059; margin: 0; font-size: 28px; font-family: serif; letter-spacing: 2px;">NYLE TRAVEL</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
            <h2 style="color: #1a1a1a; text-align: center; margin-bottom: 30px;">Verify Your Email Address</h2>
            
            <p style="font-size: 16px;">Hello <strong>${data.name}</strong>,</p>
            
            <p style="font-size: 16px;">Thank you for registering with Nyle Travel & Tours. To complete your luxury travel profile and access your dashboard, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${data.verifyUrl}" style="display: inline-block; background: #1a1a1a; color: #c5a059; padding: 18px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verify Email Address</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours. If you did not create an account with us, please ignore this email.</p>
            
            <div style="border-top: 2px solid #eee; margin-top: 40px; padding-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px;">Need assistance? Our concierge team is here to help.</p>
              <p style="margin-top: 10px;">
                <a href="mailto:concierge@nyletravel.com" style="color: #c5a059; text-decoration: none;">concierge@nyletravel.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

    case EMAIL_TEMPLATES.BOOKING_CONFIRMATION:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation - Nyle Travel</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a1a; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #c5a059; margin: 0; font-size: 28px; font-family: serif; letter-spacing: 2px;">BOOKING CONFIRMED</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
            <p>Hello <strong>${data.name}</strong>,</p>
            <p>Your luxury expedition <strong>${data.tourName}</strong> has been confirmed. Get ready for an unforgettable journey.</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
              <p style="margin: 5px 0;"><strong>Booking #:</strong> ${data.bookingNumber}</p>
              <p style="margin: 5px 0;"><strong>Departure:</strong> ${data.startDate}</p>
              <p style="margin: 5px 0;"><strong>Duration:</strong> ${data.duration} Days</p>
              <p style="margin: 5px 0;"><strong>Guests:</strong> ${data.guests}</p>
              <p style="margin: 5px 0; font-size: 18px; color: #c5a059;"><strong>Total:</strong> ${data.totalAmount} ${data.currency}</p>
            </div>
            
            <p style="font-size: 14px; color: #666;">Our concierge team will contact you shortly to finalize your personalized travel arrangements.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.dashboardUrl}" style="display: inline-block; background: #1a1a1a; color: #c5a059; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Booking</a>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Nyle Travel & Tours - Your Luxury Journey Begins',
    template: EMAIL_TEMPLATES.WELCOME,
    data: {
      name: `${user.first_name} ${user.last_name}`,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`
    },
    userId: user.id
  });
};


export const sendPasswordResetEmail = async (user, resetToken, ipAddress) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: user.email,
    subject: 'Reset Your Nyle Travel Password',
    template: EMAIL_TEMPLATES.PASSWORD_RESET,
    data: {
      name: `${user.first_name} ${user.last_name}`,
      resetUrl: resetUrl,
      ipAddress: ipAddress,
      timestamp: new Date().toLocaleString()
    },
    userId: user.id
  });
};

export const sendNewsletterWelcomeEmail = async (email) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to the Nyle Travel Inner Circle',
    template: EMAIL_TEMPLATES.NEWSLETTER_WELCOME,
    data: {
      websiteUrl: process.env.FRONTEND_URL,
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${email}`
    }
  });
};

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  return sendEmail({
    to: user.email,
    subject: 'Complete Your Registration - Nyle Travel',
    template: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
    data: {
      name: `${user.first_name} ${user.last_name}`,
      verifyUrl: verifyUrl
    },
    userId: user.id
  });
};

export const sendBookingConfirmation = async (user, booking, tour) => {
  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed: ${tour.name} (#${booking.booking_number})`,
    template: EMAIL_TEMPLATES.BOOKING_CONFIRMATION,
    data: {
      name: `${user.first_name} ${user.last_name}`,
      tourName: tour.name,
      bookingNumber: booking.booking_number,
      startDate: new Date(booking.start_date).toLocaleDateString(),
      duration: tour.duration_days,
      guests: booking.number_of_adults,
      totalAmount: booking.total_amount,
      currency: booking.currency,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/bookings/${booking.id}`
    },
    userId: user.id
  });
};

export default {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNewsletterWelcomeEmail,
  sendVerificationEmail,
  sendBookingConfirmation,
  sendEmail
};
