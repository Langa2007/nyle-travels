import multer from 'multer';
import AppError from '../utils/AppError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/svg+xml', 
    'image/gif'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error(`UPLOAD REJECTED: Invalid file type ${file.mimetype} for ${file.originalname}`);
    cb(new AppError(`Invalid file type ${file.mimetype}. Only JPEG, PNG, WEBP, SVG and GIF are allowed.`, 400), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only MP4, WEBM, and MOV are allowed for showcase video.', 400), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

export const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // Strict 50MB limit to prevent database/memory crashes
  }
});