'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMoon, FiCoffee, FiActivity, FiMap } from 'react-icons/fi';

export default function TourItinerary({ itinerary }) {
  const [activeDay, setActiveDay] = useState(0);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <FiMap size={48} className="mx-auto mb-4 opacity-20" />
        <p>No itinerary details available for this tour.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
          <FiMap size={18} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Your Expedition Timeline</h3>
      </div>

      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div 
            key={day.id || index}
            className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${
              activeDay === index 
                ? 'bg-white border-primary-500/20 shadow-xl' 
                : 'bg-gray-50 border-transparent hover:border-gray-200'
            }`}
          >
            <button
              onClick={() => setActiveDay(activeDay === index ? null : index)}
              className="w-full px-8 py-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-colors ${
                  activeDay === index ? 'bg-primary-500 text-white' : 'bg-white text-gray-400'
                }`}>
                  <span className="text-[10px] font-bold uppercase leading-none">Day</span>
                  <span className="text-lg font-serif font-bold leading-none mt-0.5">{day.day_number}</span>
                </div>
                <div>
                  <h4 className={`text-lg font-serif font-bold transition-colors ${
                    activeDay === index ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {day.title}
                  </h4>
                  {activeDay !== index && (
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                      {day.activities?.length || 0} Activities • {day.meals_included?.join(', ') || 'No meals listed'}
                    </p>
                  )}
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: activeDay === index ? 180 : 0 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  activeDay === index ? 'border-primary-100 text-primary-500' : 'border-gray-200 text-gray-400'
                }`}
              >
                <FiChevronDown size={20} />
              </motion.div>
            </button>

            <AnimatePresence>
              {activeDay === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="px-8 pb-8 pt-2">
                    <div className="pl-[72px] space-y-8">
                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                        {day.description}
                      </p>

                      {/* Accommodation & Meals */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center space-x-3 mb-4 text-primary-500">
                            <FiMoon size={18} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Overnight</span>
                          </div>
                          <h5 className="text-sm font-bold text-gray-900 mb-1">{day.accommodation_name || 'Rest and Relaxation'}</h5>
                          <p className="text-xs text-gray-500 italic">{day.accommodation_type || 'Selected Premium Stay'}</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center space-x-3 mb-4 text-primary-500">
                            <FiCoffee size={18} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Culinary</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {day.meals_included?.map(meal => (
                              <span key={meal} className="px-3 py-1 rounded-full bg-white text-[10px] font-bold text-gray-600 uppercase border border-gray-100">
                                {meal}
                              </span>
                            )) || <span className="text-xs text-gray-400 italic">No meals specified</span>}
                          </div>
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6 text-primary-500">
                          <FiActivity size={18} />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Planned Activities</span>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                          {day.activities?.map((activity, i) => (
                            <li key={i} className="flex items-center space-x-3 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                              <span>{activity}</span>
                            </li>
                          )) || <p className="text-xs text-gray-400 italic italic">Leisure time or flexible scheduling</p>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
