'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FiStar, 
  FiUpload, 
  FiX, 
  FiCheckCircle,
  FiCamera,
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi';
import Image from 'next/image';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import { reviewsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  review_text: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

export default function ReviewForm({ 
  tourId, 
  hotelId, 
  bookingId,
  onSuccess,
  onCancel,
  existingReview = null 
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pros, setPros] = useState(existingReview?.pros || []);
  const [cons, setCons] = useState(existingReview?.cons || []);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      title: existingReview?.title || '',
      review_text: existingReview?.review_text || '',
      pros: existingReview?.pros || [],
      cons: existingReview?.cons || [],
    },
  });

  const handleRatingChange = (value) => {
    setRating(value);
    setValue('rating', value);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          file,
          preview: reader.result,
          uploading: true
        }]);
      };
      reader.readAsDataURL(file);
    }

    // Simulate upload (replace with actual upload)
    setTimeout(() => {
      setImages(prev => prev.map(img => ({ ...img, uploading: false })));
      setUploading(false);
    }, 2000);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setValue('pros', [...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (index) => {
    const newPros = pros.filter((_, i) => i !== index);
    setPros(newPros);
    setValue('pros', newPros);
  };

  const addCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setValue('cons', [...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (index) => {
    const newCons = cons.filter((_, i) => i !== index);
    setCons(newCons);
    setValue('cons', newCons);
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('rating', data.rating);
      formData.append('title', data.title);
      formData.append('review_text', data.review_text);
      
      if (tourId) formData.append('tour_package_id', tourId);
      if (hotelId) formData.append('hotel_id', hotelId);
      if (bookingId) formData.append('booking_id', bookingId);
      
      data.pros?.forEach(pro => formData.append('pros[]', pro));
      data.cons?.forEach(con => formData.append('cons[]', con));
      
      images.forEach(image => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      let response;
      if (existingReview) {
        response = await reviewsAPI.update(existingReview.id, formData);
        toast.success('Review updated successfully!');
      } else {
        response = await reviewsAPI.create(formData);
        toast.success('Review submitted successfully!');
      }

      onSuccess?.(response.data.data.review);
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-serif font-bold mb-6">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <Rating
              value={rating}
              size="xl"
              interactive
              onChange={handleRatingChange}
            />
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Summarize your experience"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('review_text')}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Share details of your experience..."
          />
          {errors.review_text && (
            <p className="mt-1 text-sm text-red-600">{errors.review_text.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 text-right">
            {watch('review_text')?.length || 0}/2000
          </p>
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pros (What did you like?)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {pros.map((pro, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {pro}
                <button
                  type="button"
                  onClick={() => removePro(index)}
                  className="ml-2 text-green-700 hover:text-green-900"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add a pro (e.g., Great service)"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addPro}
              disabled={!newPro.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cons (What could be improved?)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {cons.map((con, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {con}
                <button
                  type="button"
                  onClick={() => removeCon(index)}
                  className="ml-2 text-red-700 hover:text-red-900"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add a con (e.g., Expensive)"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCon}
              disabled={!newCon.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional - Max 5)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                {image.uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <FiCamera className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Max file size: 5MB. Supported formats: JPG, PNG, WEBP
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || uploading}
            disabled={!rating}
          >
            {existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>

        {/* Verification Note */}
        <div className="flex items-center justify-center text-sm text-gray-500">
          <FiCheckCircle className="mr-2 text-green-500" />
          Your review will be verified and published within 24 hours
        </div>
      </form>
    </motion.div>
  );
}