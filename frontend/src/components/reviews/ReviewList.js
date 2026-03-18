'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, 
  FiThumbsUp, 
  FiFlag, 
  FiMoreHorizontal,
  FiCheckCircle,
  FiMessageCircle,
  FiUser
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import { reviewsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const reviewFilters = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Highest Rating', value: 'highest' },
  { label: 'Lowest Rating', value: 'lowest' },
  { label: 'Most Helpful', value: 'helpful' },
];

const ratingFilters = [5, 4, 3, 2, 1];

export default function ReviewList({ 
  tourId, 
  hotelId, 
  initialReviews = [],
  totalCount = 0,
  averageRating = 0,
  onLoadMore,
  showFilters = true,
  limit = 10,
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedRating, setSelectedRating] = useState(null);
  const [stats, setStats] = useState({
    total: totalCount,
    average: averageRating,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });
  const [helpfulReviews, setHelpfulReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [sortBy, selectedRating]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: sortBy,
        rating: selectedRating,
      };

      let response;
      if (tourId) {
        response = await reviewsAPI.getTourReviews(tourId, params);
      } else if (hotelId) {
        response = await reviewsAPI.getHotelReviews(hotelId, params);
      }

      if (response?.data?.data) {
        const newReviews = response.data.data.reviews;
        setReviews(page === 1 ? newReviews : [...reviews, ...newReviews]);
        setHasMore(newReviews.length === limit);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      let response;
      if (tourId) {
        response = await reviewsAPI.getTourReviews(tourId, { limit: 1 });
      } else if (hotelId) {
        response = await reviewsAPI.getHotelReviews(hotelId, { limit: 1 });
      }

      if (response?.data?.data?.stats) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await reviewsAPI.markHelpful(reviewId);
      setHelpfulReviews([...helpfulReviews, reviewId]);
      toast.success('Thanks for your feedback!');
    } catch (error) {
      console.error('Failed to mark helpful:', error);
      toast.error('Failed to mark as helpful');
    }
  };

  const handleReport = async (reviewId) => {
    try {
      await reviewsAPI.report(reviewId);
      toast.success('Review reported. Thank you for helping keep our community safe.');
    } catch (error) {
      console.error('Failed to report review:', error);
      toast.error('Failed to report review');
    }
  };

  const loadMore = () => {
    setPage(page + 1);
    fetchReviews();
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.average.toFixed(1)}
            </div>
            <Rating value={stats.average} size="lg" showCount={false} />
            <div className="mt-2 text-sm text-gray-500">
              Based on {stats.total} reviews
            </div>
          </div>

          {/* Rating Bars */}
          <div className="md:col-span-2 space-y-2">
            {ratingFilters.map((rating) => {
              const count = stats[`${rating}Star`] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`w-full flex items-center space-x-2 group ${
                    selectedRating === rating ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-sm font-medium w-8">{rating} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-yellow-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {reviewFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSortBy(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sortBy === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {selectedRating && (
            <button
              onClick={() => setSelectedRating(null)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-primary-100 to-secondary-100">
                    {review.user?.profile_image ? (
                      <Image
                        src={review.user.profile_image}
                        alt={review.user.first_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.user?.first_name} {review.user?.last_name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{review.user?.nationality || 'Traveler'}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(review.created_at))} ago</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <Rating value={review.rating} size="sm" showCount={false} />
              </div>

              {/* Verified Badge */}
              {review.verified_purchase && (
                <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs mb-3">
                  <FiCheckCircle className="mr-1" />
                  Verified Purchase
                </div>
              )}

              {/* Review Title */}
              <h3 className="text-lg font-semibold mb-2">{review.title}</h3>

              {/* Review Text */}
              <p className="text-gray-600 mb-4">{review.review_text}</p>

              {/* Pros & Cons */}
              {(review.pros?.length > 0 || review.cons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-600 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-red-500 mr-2">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Review Images */}
              {review.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.images.map((image, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(image, '_blank')}
                    >
                      <Image
                        src={image}
                        alt={`Review image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    disabled={helpfulReviews.includes(review.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      helpfulReviews.includes(review.id)
                        ? 'text-primary-600'
                        : 'text-gray-500 hover:text-primary-600'
                    }`}
                  >
                    <FiThumbsUp className="mr-1" />
                    <span>Helpful ({review.helpful_count})</span>
                  </button>
                  <button
                    onClick={() => handleReport(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FiFlag className="mr-1" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Admin Response */}
                {review.admin_response && (
                  <div className="text-sm text-gray-500">
                    <FiMessageCircle className="inline mr-1" />
                    Admin responded
                  </div>
                )}
              </div>

              {/* Admin Response */}
              {review.admin_response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">NT</span>
                    </div>
                    <span className="font-semibold text-sm">Nyle Travel Response</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.admin_response}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            loading={loading}
          >
            Load More Reviews
          </Button>
        </div>
      )}

      {/* No Reviews */}
      {reviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <FiMessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
          <Button variant="primary">Write a Review</Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && reviews.length === 0 && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}