'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiMapPin, FiStar, FiHeart } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@/components/ui/Button';
import { toursAPI } from '@/lib/api';
import 'swiper/css/pagination';

const defaultTours = [
  {
    id: 1,
    name: 'The Great Migration Safari',
    slug: 'great-migration-safari',
    destination: 'Maasai Mara',
    image: 'https://picsum.photos/seed/tour1/800/600',
    duration: '7 Days',
    maxGroupSize: 8,
    price: 4500,
    rating: 4.9,
    reviewCount: 124,
    badge: 'Best Seller',
    highlights: [
      'Witness the wildebeest migration',
      'Luxury tented camps',
      'Hot air balloon safari',
      'Maasai cultural visit',
    ],
  },
  {
    id: 2,
    name: 'Coastal Luxury Retreat',
    slug: 'coastal-luxury-retreat',
    destination: 'Diani Beach',
    image: 'https://picsum.photos/seed/tour2/800/600',
    duration: '5 Days',
    maxGroupSize: 2,
    price: 3200,
    rating: 4.8,
    reviewCount: 89,
    badge: 'Honeymoon Special',
    highlights: [
      'Private beach villa',
      'Spa treatments',
      'Sunset dhow cruise',
      'Gourmet dining',
    ],
  },
  {
    id: 3,
    name: 'Kilimanjaro Climb - Luxury Route',
    slug: 'kilimanjaro-luxury-climb',
    destination: 'Kilimanjaro',
    image: 'https://picsum.photos/seed/tour3/800/600',
    duration: '8 Days',
    maxGroupSize: 6,
    price: 5800,
    rating: 4.9,
    reviewCount: 56,
    badge: 'Adventure',
    highlights: [
      'Private guides',
      'Premium camping equipment',
      'Gourmet meals',
      'Summit celebration',
    ],
  },
  {
    id: 4,
    name: 'Amboseli Elephant Experience',
    slug: 'amboseli-elephant-experience',
    destination: 'Amboseli',
    image: 'https://picsum.photos/seed/tour4/800/600',
    duration: '4 Days',
    maxGroupSize: 10,
    price: 2800,
    rating: 4.7,
    reviewCount: 92,
    badge: 'Family Friendly',
    highlights: [
      'Elephant research center visit',
      'Mount Kilimanjaro views',
      'Photography safari',
      'Conservation talk',
    ],
  },
  {
    id: 5,
    name: 'Samburu Cultural Safari',
    slug: 'samburu-cultural-safari',
    destination: 'Samburu',
    image: 'https://picsum.photos/seed/tour5/800/600',
    duration: '6 Days',
    maxGroupSize: 8,
    price: 3900,
    rating: 4.8,
    reviewCount: 67,
    badge: 'Cultural',
    highlights: [
      'Samburu village visit',
      'Rare wildlife species',
      'Night game drives',
      'Cultural performances',
    ],
  },
];

export default function FeaturedTours() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tours, setTours] = useState(defaultTours);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await toursAPI.getAll({ type: 'safari', limit: 8 });
        const data = response?.data?.data?.tours || [];
        
        if (data && Array.isArray(data) && data.length > 0) {
          setTours(data);
        }
      } catch (err) {
        console.error('Failed to load safaris:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, []);

  const toggleWishlist = (tourId) => {
    setWishlist(prev =>
      prev.includes(tourId)
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="featured-tours-slider"
      >
        {Array.isArray(tours) && tours.map((tour) => (
          <SwiperSlide key={tour.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {!isLoading && (tour.image || tour.featured_image) ? (
                  <Image
                    src={tour.image || tour.featured_image}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                    {tour.badge || 'Popular'}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(tour.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <FiHeart
                    className={`w-5 h-5 transition-colors ${
                      wishlist.includes(tour.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-2xl font-bold">${tour.price}</span>
                  <span className="text-sm opacity-90">/person</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span>{tour.destination_name || tour.destination}</span>
                  <div className="mx-2">•</div>
                  <FiClock className="w-4 h-4 mr-1" />
                  <span>{tour.duration_days ? `${tour.duration_days} Days` : tour.duration}</span>
                  <div className="mx-2">•</div>
                  <FiUsers className="w-4 h-4 mr-1" />
                  <span>Max {tour.max_group_size || tour.maxGroupSize || 8}</span>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                  <Link href={`/safaris/${tour.slug}`}>
                    {tour.name}
                  </Link>
                </h3>

                {/* Highlights */}
                <ul className="space-y-2 mb-4">
                  {Array.isArray(tour.highlights) && tour.highlights.slice(0, 2).map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 shrink-0" />
                      <span className="truncate">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Rating */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <div className="ml-2 flex items-baseline">
                      <span className="font-semibold">{tour.average_rating || tour.rating || '4.9'}</span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-500">{tour.review_count || tour.reviewCount || 10} reviews</span>
                  </div>
                  <Link href={`/safaris/${tour.slug}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
