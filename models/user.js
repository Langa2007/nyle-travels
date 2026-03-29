import { query, transaction } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const User = {
  // Create new user
  async create(userData) {
    const {
      email, phone, password, first_name, last_name,
      date_of_birth, nationality, passport_number, passport_expiry
    } = userData;

    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (
        email, phone, password_hash, first_name, last_name,
        date_of_birth, nationality, passport_number, passport_expiry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, email, first_name, last_name, role, created_at`,
      [email, phone, password_hash, first_name, last_name, 
       date_of_birth, nationality, passport_number, passport_expiry]
    );
    
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      `SELECT id, email, phone, first_name, last_name, date_of_birth,
              nationality, passport_number, passport_expiry, profile_image,
              role, email_verified, phone_verified, two_factor_enabled,
              last_login, preferences, created_at, updated_at
       FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0];
  },

  // Update user
  async update(id, updates) {
    const allowedFields = [
      'first_name', 'last_name', 'phone', 'nationality',
      'passport_number', 'passport_expiry', 'profile_image',
      'preferences'
    ];
    
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (setClause.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE users SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} AND deleted_at IS NULL 
       RETURNING id, email, first_name, last_name, updated_at`,
      values
    );

    return result.rows[0];
  },

  // Update password
  async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    const result = await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [password_hash, id]
    );
    
    return result.rows[0];
  },

  // Set refresh token
  async setRefreshToken(id, refreshToken) {
    await query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, id]
    );
  },

  // Set password reset token
  async setPasswordResetToken(email, token, expires) {
    await query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
      [token, expires, email]
    );
  },

  // Find by password reset token
  async findByPasswordResetToken(token) {
    const result = await query(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW() AND deleted_at IS NULL',
      [token]
    );
    return result.rows[0];
  },

  // Clear password reset token
  async clearPasswordResetToken(id) {
    await query(
      'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = $1',
      [id]
    );
  },

  // Set email verification token
  async setEmailVerificationToken(id, token) {
    await query(
      'UPDATE users SET email_verification_token = $1 WHERE id = $2',
      [token, id]
    );
  },

  // Verify email
  async verifyEmail(token) {
    const result = await query(
      `UPDATE users SET email_verified = CURRENT_TIMESTAMP, email_verification_token = NULL 
       WHERE email_verification_token = $1 AND deleted_at IS NULL 
       RETURNING id, email`,
      [token]
    );
    return result.rows[0];
  },

  // Update last login
  async updateLastLogin(id) {
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  },

  // Soft delete user
  async delete(id) {
    await query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  },

  // Check password
  async checkPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
};