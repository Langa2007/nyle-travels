import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const restrictToAdmin = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
});

export const restrictToSuperAdmin = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return next(new AppError('This action requires super admin privileges', 403));
  }
  next();
});