import prisma from '../lib/prisma.js';
import catchAsync from '../utils/CatchAsync.js';
import AppError from '../utils/AppError.js';
import {
  sendCustomJourneyApprovalEmail,
  sendCustomJourneyRejectionEmail,
} from '../services/emailService.js';

const CUSTOM_JOURNEY_INTEREST = 'Custom Journey Request';

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string') return undefined;
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
};

const parseJourneyBrief = (message = '') =>
  message.split('\n').reduce((brief, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return brief;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) brief[key] = value;
    return brief;
  }, {});

const getCustomJourneyContact = async (id) => {
  const contact = await prisma.contact.findUnique({ where: { id } });

  if (!contact) {
    throw new AppError('No contact found with that ID', 404);
  }

  if (contact.interest !== CUSTOM_JOURNEY_INTEREST) {
    throw new AppError('This contact is not a custom journey request', 400);
  }

  return contact;
};

export const submitContact = catchAsync(async (req, res, next) => {
  if (req.body.website) {
    return res.status(201).json({
      status: 'success',
      data: { contact: null },
    });
  }

  const contact = await prisma.contact.create({
    data: {
      name: cleanText(req.body.name, 120),
      email: cleanText(req.body.email, 255)?.toLowerCase(),
      phone: cleanText(req.body.phone, 50) || null,
      interest: cleanText(req.body.interest, 255),
      message: cleanText(req.body.message, 5000),
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

  if (!['unread', 'read', 'replied', 'approved', 'not_approved'].includes(status)) {
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

export const sendCustomJourneyApproval = catchAsync(async (req, res, next) => {
  const adminNote = cleanText(req.body.adminNote || '', 1000) || '';
  const contact = await getCustomJourneyContact(req.params.id);
  const brief = parseJourneyBrief(contact.message);

  const email = await sendCustomJourneyApprovalEmail(contact, brief, adminNote);
  const updatedContact = await prisma.contact.update({
    where: { id: contact.id },
    data: { status: 'approved' },
  });

  res.status(200).json({
    status: 'success',
    data: {
      contact: updatedContact,
      email,
    },
  });
});

export const sendCustomJourneyRejection = catchAsync(async (req, res, next) => {
  const reason = cleanText(req.body.reason, 1200);
  const adminNote = cleanText(req.body.adminNote || '', 1000) || '';

  if (!reason || reason.length < 10) {
    return next(new AppError('Please provide a clear reason before sending this email', 400));
  }

  const contact = await getCustomJourneyContact(req.params.id);
  const brief = parseJourneyBrief(contact.message);

  const email = await sendCustomJourneyRejectionEmail(contact, brief, reason, adminNote);
  const updatedContact = await prisma.contact.update({
    where: { id: contact.id },
    data: { status: 'not_approved' },
  });

  res.status(200).json({
    status: 'success',
    data: {
      contact: updatedContact,
      email,
    },
  });
});
