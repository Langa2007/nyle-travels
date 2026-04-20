'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const difficultyLevels = ['easy', 'moderate', 'challenging', 'difficult'];
const durations = [
  { label: 'Short (1-5 Days)', min: 1, max: 5 },
  { label: 'Medium (6-10 Days)', min: 6, max: 10 },
  { label: 'Long (11+ Days)', min: 11, max: 30 }
];

export default function TourFilters({ filters, updateFilters, destinations = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = (e) => {
    updateFilters({ maxPrice: e.target.value });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] border border-gray-100/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
            <FiFilter size={18} />
          </div>
          <h3 className="text-lg font-serif font-bold text-gray-900">Refine Selection</h3>
        </div>
        <button 
          onClick={() => updateFilters({ 
            destination: '', 
            difficulty: '', 
            minDuration: '', 
            maxDuration: '', 
            maxPrice: 5000 
          })}
          className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary-500 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-8">
        {/* Destination */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Destination</label>
          <div className="relative">
            <select
              value={filters.destination || ''}
              onChange={(e) => updateFilters({ destination: e.target.value })}
              className="w-full appearance-none bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium border border-transparent focus:bg-white focus:border-primary-500/30 transition-all outline-none"
            >
              <option value="">All Destinations</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Difficulty Level</label>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map(lvl => (
              <button
                key={lvl}
                onClick={() => updateFilters({ difficulty: filters.difficulty === lvl ? '' : lvl })}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filters.difficulty === lvl 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Duration</label>
          <div className="space-y-2">
            {durations.map(d => (
              <button
                key={d.label}
                onClick={() => updateFilters({ 
                  minDuration: d.min, 
                  maxDuration: d.max 
                })}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                  filters.minDuration === d.min && filters.maxDuration === d.max
                    ? 'bg-primary-50 text-primary-600 border border-primary-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500">Max Budget</label>
            <span className="text-sm font-bold text-primary-600">${filters.maxPrice || 5000}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={filters.maxPrice || 5000}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="mt-10 pt-8 border-t border-gray-50">
        <button
          onClick={() => updateFilters({ isFeatured: !filters.isFeatured })}
          className={`flex items-center space-x-3 group transition-all ${
            filters.isFeatured ? 'text-primary-600' : 'text-gray-400'
          }`}
        >
          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
            filters.isFeatured ? 'bg-primary-500' : 'bg-gray-200'
          }`}>
            <motion.div 
              animate={{ x: filters.isFeatured ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Featured Only</span>
        </button>
      </div>
    </div>
  );
}
