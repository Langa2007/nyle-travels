import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
};

const createSendToken = async (user, statusCode, req, res) => {
  const token = signToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  // Save refresh token in database
  await User.setRefreshToken(user.id, refreshToken);

  // Remove sensitive data
  user.password_hash = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: { user }
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { email, password, confirmPassword, first_name, last_name, phone } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create user
  const newUser = await User.create({
    email,
    password,
    first_name,
    last_name,
    phone
  });

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await User.setEmailVerificationToken(newUser.id, verificationToken);

  // Send verification email
  try {
    const { sendVerificationEmail } = await import('../services/emailService.js');
    await sendVerificationEmail(newUser, verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Continue but maybe inform user in response?
  }

  res.status(201).json({
    status: 'success',
    message: 'Registration successful! Please check your email to verify your account.',
    data: { user: newUser }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists and password is correct
  const user = await User.findByEmail(email);
  if (!user || !(await User.checkPassword(user, password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if email is verified
  if (!user.email_verified) {
    return next(new AppError('Please verify your email address before logging in.', 401));
  }

  // Update last login
  await User.updateLastLogin(user.id);

  createSendToken(user, 200, req, res);
});

export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Clear refresh token in database
    await User.setRefreshToken(req.user.id, null);
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Please provide refresh token', 400));
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Check if user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  // Check if refresh token matches
  if (user.refresh_token !== refreshToken) {
    return next(new AppError('Invalid refresh token', 401));
  }

  // Generate new tokens
  const newToken = signToken(user.id);
  const newRefreshToken = signRefreshToken(user.id);

  // Save new refresh token
  await User.setRefreshToken(user.id, newRefreshToken);

  res.status(200).json({
    status: 'success',
    token: newToken,
    refreshToken: newRefreshToken
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Find user
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await User.setPasswordResetToken(email, resetToken, resetExpires);

  // Send email
  try {
    await sendPasswordResetEmail(user, resetToken, req.ip);
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    // Clear reset token if email fails
    await User.setPasswordResetToken(email, null, null);
    
    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Find user by reset token
  const user = await User.findByPasswordResetToken(token);
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update password
  await User.updatePassword(user.id, password);
  
  // Clear reset token
  await User.clearPasswordResetToken(user.id);

  // Clear refresh token (force re-login)
  await User.setRefreshToken(user.id, null);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful'
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.verifyEmail(token);
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // Prevent password update here
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates. Use /update-password', 400));
  }

  const updatedUser = await User.update(req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return next(new AppError('New passwords do not match', 400));
  }

  // Get user with password
  const user = await User.findByEmail(req.user.email);

  // Check current password
  if (!(await User.checkPassword(user, currentPassword))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // Update password
  await User.updatePassword(user.id, newPassword);

  // Clear refresh token (force re-login)
  await User.setRefreshToken(user.id, null);

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.delete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});