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
  TOUR_REMINDER: 'tour-reminder',
  REVIEW_REQUEST: 'review-request',
  NEWSLETTER: 'newsletter'
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
              <p style="margin-bottom: 20px;">Start exploring our exclusive collection of luxury tours and experiences across Kenya and beyond.</p>
              
              <a href="${data.dashboardUrl}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Explore Tours →</a>
            </div>
            
            <div style="margin-top: 30px;">
              <h3 style="color: #333;">What you can do with Nyle Travel:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 15px 0; padding-left: 25px; position: relative;">✓ Book exclusive luxury safaris</li>
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

    case EMAIL_TEMPLATES.BOOKING_CONFIRMATION:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - Nyle Travel</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Booking Confirmed!</h1>
            <p style="color: white; opacity: 0.9; margin-top: 10px;">Your luxury journey begins soon</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px;">Dear <strong>${data.name}</strong>,</p>
            
            <p style="font-size: 16px;">Your booking has been confirmed. Get ready for an unforgettable luxury experience!</p>
            
            <div style="background: white; border-radius: 8px; padding: 30px; margin: 30px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #43cea2; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">Booking Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666;">Booking Reference:</td>
                  <td style="padding: 10px 0; font-weight: bold;">${data.bookingNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Tour Package:</td>
                  <td style="padding: 10px 0; font-weight: bold;">${data.tourName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Start Date:</td>
                  <td style="padding: 10px 0; font-weight: bold;">${data.startDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">End Date:</td>
                  <td style="padding: 10px 0; font-weight: bold;">${data.endDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Number of Guests:</td>
                  <td style="padding: 10px 0; font-weight: bold;">${data.numberOfGuests}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Total Amount:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #43cea2;">${data.totalAmount}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333;">Next Steps:</h3>
              <ol style="padding-left: 20px;">
                <li style="margin: 10px 0;">Review your itinerary in the dashboard</li>
                <li style="margin: 10px 0;">Complete any remaining payments</li>
                <li style="margin: 10px 0;">Submit passport details for all travelers</li>
                <li style="margin: 10px 0;">Review pre-trip preparation guide</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="${data.dashboardUrl}" style="display: inline-block; background: #43cea2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Booking Details</a>
            </div>
            
            <div style="border-top: 2px solid #eee; margin-top: 40px; padding-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px;">Have questions about your upcoming journey? Our concierge team is available 24/7.</p>
              <p style="margin-top: 20px;">
                <a href="mailto:concierge@nyletravel.com" style="color: #43cea2; text-decoration: none;">concierge@nyletravel.com</a> | 
                <a href="tel:+254700000000" style="color: #43cea2; text-decoration: none;">+254 700 000 000</a>
              </p>
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

    // Add more templates as needed...

    default:
      return `<p>${JSON.stringify(data)}</p>`;
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

export const sendBookingConfirmation = async (user, booking, tourPackage) => {
  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed: ${tourPackage.name} - Nyle Travel`,
    template: EMAIL_TEMPLATES.BOOKING_CONFIRMATION,
    data: {
      name: `${user.first_name} ${user.last_name}`,
      bookingNumber: booking.booking_number,
      tourName: tourPackage.name,
      startDate: new Date(booking.start_date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      endDate: new Date(booking.end_date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      numberOfGuests: booking.number_of_adults + (booking.number_of_children || 0),
      totalAmount: new Intl.NumberFormat('en-KE', { 
        style: 'currency', 
        currency: booking.currency 
      }).format(booking.total_amount),
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/bookings/${booking.id}`
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

export default {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendEmail
};