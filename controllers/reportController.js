import Report from '../models/Report.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export const submitReport = catchAsync(async (req, res, next) => {
  const report = await Report.create({
    type: req.body.type,
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
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
  const sort = req.query.sort || '-createdAt';

  // Build query
  let queryStr = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryStr[el]);

  const reports = await Report.find(queryStr)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Report.countDocuments(queryStr);

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
  const report = await Report.findById(req.params.id);

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

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

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
