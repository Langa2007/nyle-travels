import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('CLOUDINARY_CLOUD_NAME is missing from environment variables!');
}

export const cloudinaryService = {
  // Upload an image from buffer
  async uploadFromBuffer(fileBuffer, folder = 'nyle-travel', options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload_stream ERROR:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  },

  // Upload an image from URL
  async uploadFromUrl(imageUrl, folder = 'nyle-travel', options = {}) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
        ...options
      });
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultiple(files, folder = 'nyle-travel') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFromBuffer(file.buffer, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  },

  // Delete an image
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  // Get optimized image URL with transformations
  getOptimizedUrl(publicId, options = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      fetch_format: 'auto',
      quality: 'auto',
      ...options
    });
  },

  // Get image with specific dimensions
  getResizedUrl(publicId, width, height, options = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      width: width,
      height: height,
      crop: 'fill',
      gravity: 'auto',
      ...options
    });
  },

  // Create image tag with responsive options
  getImageTag(publicId, options = {}) {
    return cloudinary.image(publicId, {
      secure: true,
      ...options
    });
  },

  // Generate video thumbnail
  async generateVideoThumbnail(videoPublicId, options = {}) {
    try {
      const result = await cloudinary.url(videoPublicId, {
        resource_type: 'video',
        secure: true,
        format: 'jpg',
        ...options
      });
      return result;
    } catch (error) {
      console.error('Video thumbnail error:', error);
      throw error;
    }
  }
};

export default cloudinaryService;