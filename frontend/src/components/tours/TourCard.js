'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiStar, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function TourCard({ tour }) {
  const {
    name,
    slug,
    featured_image,
    duration_days,
    group_size_max,
    difficulty_level,
    base_price,
    average_rating,
    review_count,
    destination_name
  } = tour;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] border border-gray-100/50 transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)]"
    >
      {/* Image Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={featured_image || '/images/tours/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex space-x-2">
          {difficulty_level && (
            <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
              {difficulty_level}
            </div>
          )}
        </div>

        {/* Price tag */}
        <div className="absolute bottom-6 right-6 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-0.5">From</p>
          <p className="text-xl font-serif font-bold text-primary-600">${base_price}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-500">
            {destination_name}
          </p>
          <div className="flex items-center space-x-1">
            <FiStar className="text-amber-400 fill-amber-400" size={14} />
            <span className="text-xs font-bold text-gray-900">{Number(average_rating).toFixed(1)}</span>
            <span className="text-[10px] text-gray-400 font-medium">({review_count})</span>
          </div>
        </div>

        <Link href={`/tours/${slug}`}>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 group-hover:text-primary-600 transition-colors leading-tight">
            {name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="flex items-center justify-between py-6 border-t border-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-primary-50 transition-colors">
              <FiClock className="text-primary-500" size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-900 uppercase">{duration_days} Days</span>
          </div>
          
          <div className="w-px h-8 bg-gray-100" />
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-primary-50 transition-colors">
              <FiUsers className="text-primary-500" size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-900 uppercase">Up to {group_size_max}</span>
          </div>
          
          <div className="w-px h-8 bg-gray-100" />
          
          <Link href={`/tours/${slug}`}>
            <motion.div 
              whileHover={{ x: 5 }}
              className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30"
            >
              <FiChevronRight size={20} />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
