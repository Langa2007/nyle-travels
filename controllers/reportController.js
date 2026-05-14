import prisma from '../lib/prisma.js';
import catchAsync from '../utils/CatchAsync.js';
import AppError from '../utils/AppError.js';

export const submitReport = catchAsync(async (req, res, next) => {
  const report = await prisma.report.create({
    data: {
      type: req.body.type,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      report,
    },
  });
});

export const getReports = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Filters
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.type) where.type = req.query.type;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const getReport = catchAsync(async (req, res, next) => {
  const report = await prisma.report.findUnique({
    where: { id: req.params.id },
  });

  if (!report) {
    return next(new AppError('No report found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});

export const updateReportStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'reviewing', 'resolved'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { status },
  });

  if (!report) {
    return next(new AppError('No report found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});
