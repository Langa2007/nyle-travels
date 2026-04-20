'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { toursAPI } from '@/lib/api';
import { toursAPI } from '@/lib/api';
import TourHero from '@/components/tours/TourHero';
import TourItinerary from '@/components/tours/TourItinerary';
import TourCard from '@/components/tours/TourCard';
import Button from '@/components/ui/Button';

export default function TourDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await toursAPI.getOne(slug);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError(err.response?.data?.message || 'Tour not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-serif italic">Preparing your journey...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-8">
          <FiX size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Voyage Not Found</h1>
        <p className="text-gray-500 max-w-md mb-8">{error || "The specific adventure you're looking for doesn't seem to exist."}</p>
        <Button href="/tours" variant="primary">Return to Catalog</Button>
      </div>
    );
  }

  const { tour, itinerary, availability, similarTours } = data;

  return (
    <main className="bg-[#fafbfc]">
      
      <TourHero tour={tour} />

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-20">
          
          <div className="flex-1 space-y-24">
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                  <FiInfo size={18} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Expedition Archetype</h3>
              </div>
              <div className="prose prose-lg text-gray-600 font-medium leading-relaxed max-w-4xl">
                <p className="whitespace-pre-line">{tour.description}</p>
              </div>
            </section>

            {/* Highlights */}
            <section id="highlights" className="scroll-mt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.highlights?.map((highlight, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-8 rounded-[2rem] bg-white border border-gray-50 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
                      <FiCheck size={16} strokeWidth={3} />
                    </div>
                    <p className="text-gray-700 font-bold leading-tight">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section id="itinerary" className="scroll-mt-32">
              <TourItinerary itinerary={itinerary} />
            </section>

            {/* Inclusions & Exclusions */}
            <section id="details" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
              <div className="space-y-8">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500">Included</h4>
                <ul className="space-y-4">
                  {tour.included_items?.map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                      <FiCheck className="text-green-500 shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-400">Excluded</h4>
                <ul className="space-y-4">
                  {tour.excluded_items?.map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                      <FiX className="text-red-400 shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[420px] shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="rounded-[3rem] bg-white p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-gray-100/50">
                <h4 className="text-2xl font-serif font-bold text-gray-900 mb-8 tracking-tight">Reserve Expedition</h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3">Preferred Era</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer">
                        {availability?.length > 0 ? (
                          availability.map(avail => (
                            <option key={avail.id} value={avail.id}>
                              {new Date(avail.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {avail.available_slots} Slots
                            </option>
                          ))
                        ) : (
                          <option>Contact for Custom Dates</option>
                        )}
                      </select>
                      <FiCalendar className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-2xl bg-primary-50/50 border border-primary-50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-primary-600 tracking-widest mb-1">Total Voyage Cost</p>
                      <p className="text-2xl font-serif font-bold text-gray-900">${tour.base_price}</p>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-primary-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/30">
                      Inquire
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Personalized consultation included for all <br /> Nyle Luxury itineraries.
                  </p>
                </div>
              </div>

              <div className="rounded-[3rem] bg-gray-950 p-10 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/30 rounded-full blur-3xl -mr-16 -mt-16" />
                <h5 className="text-xl font-serif font-bold italic mb-4 relative z-10">Exclusive Add-ons</h5>
                <p className="text-gray-400 text-xs mb-8 relative z-10 leading-relaxed">Elevate your experience with private jet transfers or luxury heli-safaris.</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-bold text-primary-400 uppercase tracking-widest">
                    <FiArrowRight /> <span>Private Chauffeur</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-bold text-primary-400 uppercase tracking-widest">
                    <FiArrowRight /> <span>Suite Upgrades</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Tours */}
        {similarTours?.length > 0 && (
          <section className="mt-40 border-t border-gray-100 pt-24">
            <div className="flex items-center justify-between mb-16 px-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-500 mb-4">Expand your horizons</p>
                <h3 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Analogous Expeditions</h3>
              </div>
              <Button href="/tours" variant="outline" className="!rounded-full px-8">Explore Catalog</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarTours.map(simTour => (
                <TourCard key={simTour.id} tour={simTour} />
              ))}
            </div>
          </section>
        )}
      </div>

    </main>
  );
}
