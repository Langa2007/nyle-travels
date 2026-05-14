import prisma from '../lib/prisma.js';
import catchAsync from '../utils/CatchAsync.js';
import AppError from '../utils/AppError.js';

export const submitContact = catchAsync(async (req, res, next) => {
  const contact = await prisma.contact.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      interest: req.body.interest,
      message: req.body.message,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      contact,
    },
  });
});

export const getContacts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Filters
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.interest) where.interest = req.query.interest;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const getContact = catchAsync(async (req, res, next) => {
  const contact = await prisma.contact.findUnique({
    where: { id: req.params.id },
  });

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});

export const updateContactStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['unread', 'read', 'replied'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const contact = await prisma.contact.update({
    where: { id: req.params.id },
    data: { status },
  });

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});
