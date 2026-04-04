'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/common/DatePicker';
import { defaultHeroSlides, normalizeHeroSlides } from '@/data/heroSlides';
import { fetchSettings } from '@/utils/settings';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    date: null,
    guests: 2,
  });

  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);

  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const data = await fetchSettings('hero_sections');
        setHeroSlides(normalizeHeroSlides(data));
      } finally {
        setIsLoading(false);
      }
    };
    loadHeroSlides();
  }, []);

  useEffect(() => {
    // 30 Seconds timeframe
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {!isLoading && heroSlides[currentSlide]?.image ? (
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          {/* Animated Text */}
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-sm mb-6 backdrop-blur-sm">
              {heroSlides[currentSlide].subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-md">
              {heroSlides[currentSlide].description}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  >
                    <option value="" className="text-gray-900">Select Destination</option>
                    <option value="maasai-mara" className="text-gray-900">Maasai Mara</option>
                    <option value="diani" className="text-gray-900">Diani Beach</option>
                    <option value="amboseli" className="text-gray-900">Amboseli</option>
                    <option value="tsavo" className="text-gray-900">Tsavo</option>
                  </select>
                </div>

                <div className="relative w-full z-50">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10" />
                  <DatePicker
                    selected={searchParams.date}
                    onChange={(date) => setSearchParams({ ...searchParams, date })}
                    placeholderText="Select Date"
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) })}
                    placeholder="Guests"
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <Link href="/search" className="w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Search
                      <FiSearch className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'w-12 bg-white'
                    : 'w-4 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 right-10 hidden md:block"
          >
            <div className="w-10 h-16 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
