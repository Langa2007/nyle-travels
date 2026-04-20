'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFrown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useTourCatalog from '@/hooks/useTourCatalog';
import { destinationsAPI } from '@/lib/api';
import TourCard from '@/components/tours/TourCard';
import TourFilters from '@/components/tours/TourFilters';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TourCatalogPage() {
  const {
    tours,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    filters,
    updateFilters,
    nextPage,
    prevPage
  } = useTourCatalog();

  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll();
        setDestinations(response.data.data.destinations);
      } catch (err) {
        console.error('Failed to fetch destinations', err);
      }
    };
    fetchDestinations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        >
          <source src="https://player.vimeo.com/external/370331493.hd.mp4?s=3333333333333333333333333333333333333333&profile_id=175" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-[#fafbfc]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-400 mb-6"
          >
            Nyle Luxury Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tight"
          >
            Unforgettable <br />
            <span className="italic font-normal text-primary-400">Experiences</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative px-4"
          >
            <div className="relative group">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search your next adventure..."
                className="w-full bg-white/90 backdrop-blur-xl border-none rounded-[2rem] px-16 py-6 text-lg focus:outline-none focus:ring-4 focus:ring-primary-500/20 shadow-2xl transition-all"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary-500 rounded-full text-white font-bold text-sm shadow-lg shadow-primary-500/30">
                Search
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-32">
              <TourFilters 
                filters={filters} 
                updateFilters={updateFilters} 
                destinations={destinations} 
              />
              
              <div className="mt-8 rounded-[2.5rem] bg-gray-950 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
                <h4 className="text-xl font-serif font-bold mb-4 relative z-10 italic">Need expert advice?</h4>
                <p className="text-gray-400 text-sm mb-6 relative z-10">Our luxury travel consultants are ready to curate your perfect itinerary.</p>
                <button className="w-full py-4 rounded-2xl bg-white text-gray-900 font-bold text-sm tracking-widest uppercase hover:bg-primary-500 hover:text-white transition-all">
                  Contact Specialist
                </button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif font-bold text-gray-900">{total}</span>
                <span className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Tours Found</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sort By:</span>
                <select 
                  className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer"
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                >
                  <option value="created_at">Latest</option>
                  <option value="base_price">Price (Low to High)</option>
                  <option value="duration_days">Duration</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-[2.5rem] h-96 animate-pulse" />
                  ))}
                </motion.div>
              ) : tours.length > 0 ? (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-40 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                    <FiFrown className="text-gray-300" size={48} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No matching tours</h3>
                  <p className="text-gray-500 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button 
                    onClick={() => updateFilters({ search: '', destination: '', difficulty: '' })}
                    className="mt-8 text-primary-500 font-bold text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center space-x-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-900 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={20} />
                </button>
                
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilters({ page: i + 1 })}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                        currentPage === i + 1 
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                          : 'bg-white text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-900 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
