import { query } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const getSettings = async (req, res, next) => {
  try {
    const { key } = req.params;
    let result;
    if (key) {
      result = await query('SELECT value FROM app_settings WHERE key = $1', [key]);
      return res.status(200).json({ status: 'success', data: result.rows[0]?.value || null });
    } else {
      result = await query('SELECT * FROM app_settings');
      const settings = {};
      result.rows.forEach(row => { settings[row.key] = row.value; });
      return res.status(200).json({ status: 'success', data: settings });
    }
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    for (const key of keys) {
      await query(`
        INSERT INTO app_settings (key, value) 
        VALUES ($1, $2) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [key, JSON.stringify(req.body[key])]);
    }
    
    res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const isVideo = req.file.mimetype.startsWith('video');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'nyle_travels/settings',
        resource_type: isVideo ? 'video' : 'image',
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ status: 'error', message: 'Failed to upload media' });
        }
        res.status(200).json({ status: 'success', data: { url: result.secure_url } });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};
