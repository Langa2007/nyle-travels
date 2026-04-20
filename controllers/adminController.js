import { query, transaction } from '../config/db.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import { User } from '../models/user.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { sendEmail } from '../services/emailService.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const [totalUsers, totalBookings, totalRevenue, recentActivity] = await Promise.all([
    // Total users
    query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL'),
    
    // Total bookings
    query('SELECT COUNT(*) FROM bookings'),
    
    // Total revenue
    query('SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = \'success\''),
    
    // Recent activity
    query(`
      (SELECT 'booking' as type, id, booking_number as reference, created_at 
       FROM bookings ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'user' as type, id, email as reference, created_at 
       FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'payment' as type, id, payment_number as reference, created_at 
       FROM payments ORDER BY created_at DESC LIMIT 5)
      ORDER BY created_at DESC LIMIT 10
    `)
  ]);

  // Monthly stats for chart
  const monthlyStats = await query(`
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as total_bookings,
      COALESCE(SUM(total_amount), 0) as revenue
    FROM bookings
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month')
    ORDER BY month DESC
  `);

  res.status(200).json({
    status: 'success',
    data: {
      overview: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalBookings: parseInt(totalBookings.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].coalesce),
      },
      monthlyStats: monthlyStats.rows,
      recentActivity: recentActivity.rows
    }
  });
});

// ==================== USER MANAGEMENT ====================

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, search, role, status, sort = '-created_at' } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = ['deleted_at IS NULL'];
  const values = [];
  let paramIndex = 1;

  if (search) {
    whereClause.push(`(email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (role) {
    whereClause.push(`role = $${paramIndex}`);
    values.push(role);
    paramIndex++;
  }

  if (status === 'verified') {
    whereClause.push('email_verified = TRUE');
  } else if (status === 'unverified') {
    whereClause.push('email_verified = FALSE');
  }

  const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

  // Get users with booking stats
  const users = await query(`
    SELECT 
      u.*,
      COUNT(DISTINCT b.id) as total_bookings,
      COALESCE(SUM(p.amount), 0) as total_spent,
      COUNT(DISTINCT CASE WHEN b.created_at >= NOW() - INTERVAL '30 days' THEN b.id END) as recent_bookings
    FROM users u
    LEFT JOIN bookings b ON u.id = b.user_id
    LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'success'
    ${whereString}
    GROUP BY u.id
    ORDER BY ${sort.replace('-', '')} ${sort.startsWith('-') ? 'DESC' : 'ASC'}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `, [...values, limit, offset]);

  const total = await query(`SELECT COUNT(*) FROM users ${whereString}`, values);

  res.status(200).json({
    status: 'success',
    data: {
      users: users.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(total.rows[0].count / limit)
      }
    }
  });
});

export const getUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user's complete history
  const [bookings, payments, reviews, activity] = await Promise.all([
    // Bookings with tour details
    query(`
      SELECT b.*
      FROM bookings b
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]),

    // Payments
    query(`
      SELECT p.*, b.booking_number
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `, [userId]),

    // Reviews
    query(`
      SELECT r.*
      FROM reviews r
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]),

    // Login activity
    query(`
      SELECT * FROM user_activity 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [userId])
  ]);

  // Calculate stats
  const stats = {
    totalBookings: bookings.rows.length,
    totalSpent: payments.rows.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0),
    completedBookings: bookings.rows.filter(b => b.booking_status === 'completed').length,
    cancelledBookings: bookings.rows.filter(b => b.booking_status === 'cancelled').length,
    averageRating: reviews.rows.reduce((sum, r) => sum + r.rating, 0) / (reviews.rows.length || 1),
    memberSince: user.created_at,
    lastActive: activity.rows[0]?.created_at || user.last_login
  };

  res.status(200).json({
    status: 'success',
    data: {
      user,
      stats,
      bookings: bookings.rows,
      payments: payments.rows,
      reviews: reviews.rows,
      activity: activity.rows
    }
  });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin', 'super_admin', 'guide', 'partner'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  const user = await query(
    'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [role, userId]
  );

  if (!user.rows[0]) {
    return next(new AppError('User not found', 404));
  }

  // Log admin action
  await logAdminAction(req.user.id, 'UPDATE_USER_ROLE', {
    userId,
    newRole: role,
    timestamp: new Date()
  });

  res.status(200).json({
    status: 'success',
    data: { user: user.rows[0] }
  });
});

export const toggleUserStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { action } = req.body; // 'suspend', 'activate', 'delete'

  let queryStr;
  switch (action) {
    case 'suspend':
      queryStr = 'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      break;
    case 'activate':
      queryStr = 'UPDATE users SET status = $1, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      break;
    case 'delete':
      queryStr = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      break;
    default:
      return next(new AppError('Invalid action', 400));
  }

  const result = await query(queryStr, [action === 'suspend' ? 'suspended' : 'active', userId]);

  if (!result.rows[0]) {
    return next(new AppError('User not found', 404));
  }

  // Send email notification
  if (action === 'suspend') {
    await sendEmail({
      to: result.rows[0].email,
      subject: 'Account Suspended - Nyle Travel',
      template: 'account_suspended',
      data: { user: result.rows[0] }
    });
  }

  res.status(200).json({
    status: 'success',
    data: { user: result.rows[0] }
  });
});

// ==================== BOOKING MANAGEMENT ====================

export const getAllBookings = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    dateFrom, 
    dateTo, 
    search,
    sort = '-created_at' 
  } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = ['1=1'];
  const values = [];
  let paramIndex = 1;

  if (status) {
    whereClause.push(`booking_status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  if (dateFrom) {
    whereClause.push(`start_date >= $${paramIndex}`);
    values.push(dateFrom);
    paramIndex++;
  }

  if (dateTo) {
    whereClause.push(`end_date <= $${paramIndex}`);
    values.push(dateTo);
    paramIndex++;
  }

  if (search) {
    whereClause.push(`(booking_number ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereString = whereClause.join(' AND ');

  const bookings = await query(`
    SELECT 
      b.*,
      u.email as user_email,
      u.first_name,
      u.last_name,
      u.phone as user_phone
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    WHERE ${whereString}
    ORDER BY ${sort.replace('-', '')} ${sort.startsWith('-') ? 'DESC' : 'ASC'}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `, [...values, limit, offset]);

  const total = await query(`
    SELECT COUNT(*) 
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    WHERE ${whereString}
  `, values);

  res.status(200).json({
    status: 'success',
    data: {
      bookings: bookings.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(total.rows[0].count / limit)
      }
    }
  });
});

export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { status, reason, sendNotification = true } = req.body;

  const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid booking status', 400));
  }

  const booking = await Booking.updateStatus(bookingId, status, reason);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Get user details for notification
  const user = await User.findById(booking.user_id);

  // Send notification
  if (sendNotification) {
    await sendEmail({
      to: user.email,
      subject: `Booking ${status} - Nyle Travel`,
      template: `booking_${status}`,
      data: { booking, user }
    });
  }

  res.status(200).json({
    status: 'success',
    data: { booking }
  });
});


// ==================== PAYMENT MANAGEMENT ====================

export const getAllPayments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, dateFrom, dateTo, search } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = ['1=1'];
  const values = [];
  let paramIndex = 1;

  if (status) {
    whereClause.push(`p.status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  if (dateFrom) {
    whereClause.push(`p.created_at >= $${paramIndex}`);
    values.push(dateFrom);
    paramIndex++;
  }

  if (dateTo) {
    whereClause.push(`p.created_at <= $${paramIndex}`);
    values.push(dateTo);
    paramIndex++;
  }

  if (search) {
    whereClause.push(`(p.payment_number ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR b.booking_number ILIKE $${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereString = whereClause.join(' AND ');

  const payments = await query(`
    SELECT 
      p.*,
      u.email as user_email,
      u.first_name,
      u.last_name,
      b.booking_number,
      b.total_amount as booking_total
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN bookings b ON p.booking_id = b.id
    WHERE ${whereString}
    ORDER BY p.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `, [...values, limit, offset]);

  const total = await query(`
    SELECT COUNT(*) 
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN bookings b ON p.booking_id = b.id
    WHERE ${whereString}
  `, values);

  res.status(200).json({
    status: 'success',
    data: {
      payments: payments.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(total.rows[0].count / limit)
      }
    }
  });
});

export const processRefund = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  const refund = await Payment.refund(paymentId, amount, reason);

  res.status(200).json({
    status: 'success',
    data: { refund }
  });
});

// ==================== REPORTS & ANALYTICS ====================

export const generateReport = catchAsync(async (req, res, next) => {
  const { type, format = 'json', dateFrom, dateTo } = req.query;

  let data;
  switch (type) {
    case 'revenue':
      data = await generateRevenueReport(dateFrom, dateTo);
      break;
    case 'bookings':
      data = await generateBookingsReport(dateFrom, dateTo);
      break;
    case 'users':
      data = await generateUsersReport(dateFrom, dateTo);
      break;
    default:
      return next(new AppError('Invalid report type', 400));
  }

  if (format === 'excel') {
    const workbook = await generateExcelReport(type, data);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
  } else if (format === 'pdf') {
    const pdf = await generatePDFReport(type, data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report-${Date.now()}.pdf`);
    pdf.pipe(res);
  } else {
    res.status(200).json({
      status: 'success',
      data
    });
  }
});

// ==================== ANALYTICS ====================

export const getAdvancedAnalytics = catchAsync(async (req, res, next) => {
  const { period = 'month' } = req.query;

  const [userGrowth, bookingTrends, revenueBySource, topDestinations, peakTimes] = await Promise.all([
    // User growth
    query(`
      SELECT 
        DATE_TRUNC('${period}', created_at) as date,
        COUNT(*) as new_users,
        COUNT(CASE WHEN email_verified THEN 1 END) as verified_users
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('${period}', created_at)
      ORDER BY date DESC
    `),

    // Booking trends
    query(`
      SELECT 
        DATE_TRUNC('${period}', created_at) as date,
        COUNT(*) as bookings,
        COALESCE(SUM(total_amount), 0) as revenue,
        AVG(total_amount) as avg_booking_value
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('${period}', created_at)
      ORDER BY date DESC
    `),

    // Revenue by source/payment method
    query(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'success' AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY payment_method
    `),

    // Top destinations
    query(`
      SELECT 
        d.name as destination,
        COUNT(*) as bookings,
        COALESCE(SUM(b.total_amount), 0) as revenue
      FROM bookings b
      JOIN tour_packages tp ON b.tour_package_id = tp.id
      JOIN destinations d ON tp.destination_id = d.id
      WHERE b.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY d.name
      ORDER BY bookings DESC
      LIMIT 10
    `),

    // Peak booking times
    query(`
      SELECT 
        EXTRACT(DOW FROM start_date) as day_of_week,
        COUNT(*) as bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY EXTRACT(DOW FROM start_date)
      ORDER BY day_of_week
    `)
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      userGrowth: userGrowth.rows,
      bookingTrends: bookingTrends.rows,
      revenueBySource: revenueBySource.rows,
      topDestinations: topDestinations.rows,
      peakTimes: peakTimes.rows
    }
  });
});

// ==================== HELPER FUNCTIONS ====================

const logAdminAction = async (adminId, action, details) => {
  await query(
    `INSERT INTO admin_logs (admin_id, action, details, created_at) 
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
    [adminId, action, JSON.stringify(details)]
  );
};

const generateRevenueReport = async (dateFrom, dateTo) => {
  const result = await query(`
    SELECT 
      DATE_TRUNC('day', p.created_at) as date,
      COUNT(DISTINCT p.booking_id) as bookings,
      COUNT(*) as transactions,
      COALESCE(SUM(p.amount), 0) as revenue,
      COALESCE(SUM(CASE WHEN p.status = 'refunded' THEN p.amount END), 0) as refunds,
      COALESCE(AVG(p.amount), 0) as avg_transaction
    FROM payments p
    WHERE p.created_at BETWEEN $1 AND $2
    GROUP BY DATE_TRUNC('day', p.created_at)
    ORDER BY date DESC
  `, [dateFrom, dateTo]);

  const totals = await query(`
    SELECT 
      COALESCE(SUM(CASE WHEN status = 'success' THEN amount END), 0) as total_revenue,
      COALESCE(SUM(CASE WHEN status = 'refunded' THEN amount END), 0) as total_refunds,
      COUNT(*) as total_transactions
    FROM payments
    WHERE created_at BETWEEN $1 AND $2
  `, [dateFrom, dateTo]);

  return {
    daily: result.rows,
    totals: totals.rows[0]
  };
};

const generateExcelReport = async (type, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${type} Report`);

  // Add headers
  worksheet.columns = Object.keys(data.daily[0] || {}).map(key => ({
    header: key,
    key: key,
    width: 20
  }));

  // Add data
  worksheet.addRows(data.daily);

  // Add totals row
  worksheet.addRow({
    date: 'TOTAL',
    ...data.totals
  });

  // Style the header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' }
  };

  return workbook;
};

const generatePDFReport = (type, data) => {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text(`${type.toUpperCase()} Report`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();
  
  // Add summary
  doc.fontSize(14).text('Summary');
  Object.entries(data.totals).forEach(([key, value]) => {
    doc.fontSize(10).text(`${key}: ${value}`);
  });
  
  doc.moveDown();
  
  // Add daily data
  doc.fontSize(14).text('Daily Breakdown');
  data.daily.forEach(row => {
    doc.fontSize(8).text(JSON.stringify(row));
  });

  return doc;
};