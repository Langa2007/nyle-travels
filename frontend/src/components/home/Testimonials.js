'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchSettings } from '@/utils/settings';

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'United Kingdom',
    avatar: 'https://picsum.photos/seed/6l1rop/800/600',
    tour: 'Great Migration Safari',
    rating: 5,
    text: 'Absolutely incredible experience! The team at Nyle Travel curated the perfect safari for us. From the luxury accommodations to the expert guides, every detail was perfect. Seeing the wildebeest migration was a dream come true.',
    date: 'March 2024',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Singapore',
    avatar: 'https://picsum.photos/seed/ka3cp/800/600',
    tour: 'Luxury Beach Retreat',
    rating: 5,
    text: 'The beach villa in Diani was paradise on earth. The attention to detail and personalized service made our honeymoon unforgettable. Already planning our next trip with Nyle!',
    date: 'February 2024',
  },
  {
    id: 3,
    name: 'Emma Williams',
    location: 'Australia',
    avatar: 'https://picsum.photos/seed/w4mnf6/800/600',
    tour: 'Kilimanjaro Climb',
    rating: 5,
    text: 'Conquering Kilimanjaro was challenging but the support from Nyle\'s team was outstanding. The guides were professional, the equipment was top-notch, and the celebration at the summit was magical.',
    date: 'January 2024',
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Canada',
    avatar: 'https://picsum.photos/seed/nzppg/800/600',
    tour: 'Family Safari Adventure',
    rating: 5,
    text: 'Traveling with our three kids was made easy thanks to Nyle. They arranged child-friendly activities and accommodations that kept everyone happy. The kids still talk about the giraffe feeding!',
    date: 'December 2023',
  },
];

export default function Testimonials() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonials, setActiveTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchSettings('testimonials');
        if (data && Array.isArray(data) && data.length > 0) {
          const nextTestimonials = data.map((item, index) => ({
            ...defaultTestimonials[index % defaultTestimonials.length],
            ...item,
            avatar: item.avatar || ''
          }));

          if (nextTestimonials.some((item) => item.avatar)) {
            setActiveTestimonials(nextTestimonials);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: '.testimonial-prev',
          nextEl: '.testimonial-next',
        }}
        pagination={{ 
          clickable: true,
          el: '.testimonial-pagination',
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="testimonials-slider"
      >
        {activeTestimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 h-full border border-white/20"
            >
              {/* Quote Icon */}
              <FiMessageSquare className="w-10 h-10 text-primary-400 mb-6" />

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 mb-6 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border border-white/20">
                  {!isLoading && testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      unoptimized={testimonial.avatar.startsWith('http')}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/10" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.tour}</p>
                </div>
              </div>

              {/* Date */}
              <div className="mt-4 text-xs text-gray-500">
                {testimonial.date}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="flex items-center justify-center mt-8 space-x-4">
        <button className="testimonial-prev w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <div className="testimonial-pagination flex space-x-2" />
        <button className="testimonial-next w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
