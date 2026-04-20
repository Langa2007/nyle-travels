'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiMapPin, FiBarChart2 } from 'react-icons/fi';

export default function TourHero({ tour }) {
  const {
    name,
    featured_image,
    duration_days,
    group_size_max,
    difficulty_level,
    destination_name,
    base_price,
    gallery_images = []
  } = tour;

  return (
    <section className="relative min-h-[85vh] flex items-end pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featured_image || '/images/tours/hero-placeholder.jpg'}
          alt={name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gray-900/20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          
          <div className="max-w-3xl">
            {/* Breadcrumbs/Meta */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-primary-500/20 backdrop-blur-md border border-primary-500/30 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
                {destination_name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Elite Collection
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-10 leading-tight tracking-tight"
            >
              {name}
            </motion.h1>

            {/* Quick Specs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-primary-400 mb-2">
                  <FiClock size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Duration</span>
                </div>
                <p className="text-white font-serif text-lg font-bold">{duration_days} Days</p>
              </div>

              <div className="flex flex-col border-l border-white/10 pl-6">
                <div className="flex items-center space-x-2 text-primary-400 mb-2">
                  <FiUsers size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Group Size</span>
                </div>
                <p className="text-white font-serif text-lg font-bold">Max {group_size_max}</p>
              </div>

              <div className="flex flex-col border-l border-white/10 pl-6">
                <div className="flex items-center space-x-2 text-primary-400 mb-2">
                  <FiBarChart2 size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Difficulty</span>
                </div>
                <p className="text-white font-serif text-lg font-bold capitalize">{difficulty_level}</p>
              </div>

              <div className="flex flex-col border-l border-white/10 pl-6">
                <div className="flex items-center space-x-2 text-primary-400 mb-2">
                  <FiMapPin size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Location</span>
                </div>
                <p className="text-white font-serif text-lg font-bold truncate">{destination_name}</p>
              </div>
            </motion.div>
          </div>

          {/* Pricing Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="shrink-0 p-10 rounded-[3rem] bg-white shadow-2xl text-center lg:text-left"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">Starting From</p>
            <div className="flex items-baseline justify-center lg:justify-start space-x-2 mb-8">
              <span className="text-5xl font-serif font-bold text-gray-900">${base_price}</span>
              <span className="text-gray-400 font-medium">/ person</span>
            </div>
            
            <button className="w-full lg:w-48 py-5 rounded-2xl bg-primary-500 text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:shadow-primary-500/40 transition-all active:scale-95">
              Check Dates
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
