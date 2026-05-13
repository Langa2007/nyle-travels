import Contact from '../models/Contact.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendEmail } from '../services/emailService.js';

export const submitContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    interest: req.body.interest,
    message: req.body.message,
  });

  // Optionally send email notification to admin here
  // await sendEmail({
  //   email: process.env.ADMIN_EMAIL || 'admin@nyletravel.com',
  //   subject: `New Inquiry from ${contact.name}`,
  //   message: `You have received a new inquiry.\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nInterest: ${contact.interest}\nMessage: ${contact.message}`,
  // });

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
  const sort = req.query.sort || '-createdAt';

  // Build query
  let queryStr = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryStr[el]);

  const contacts = await Contact.find(queryStr)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Contact.countDocuments(queryStr);

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
  const contact = await Contact.findById(req.params.id);

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

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

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
