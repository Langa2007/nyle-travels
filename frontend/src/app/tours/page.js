'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiMapPin,
  FiSearch,
  FiSliders,
  FiStar,
  FiSun,
  FiClock,
  FiUsers,
  FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import Button from '@/components/ui/Button';
import useTourCatalog from '@/hooks/useTourCatalog';
import {
  filterTours,
  getFeaturedTours,
  getTourImage,
} from '@/lib/tourCatalog';

const defaultFilters = {
  search: '',
  type: 'all',
  duration: 'all',
  destination: 'all',
  difficulty: 'all',
};

function ToursPageContent() {
  const searchParams = useSearchParams();
  const { tours, loading } = useTourCatalog();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      duration: searchParams.get('duration') || 'all',
      destination: searchParams.get('destination') || 'all',
      difficulty: searchParams.get('difficulty') || 'all',
    });
  }, [searchParams]);

  const destinations = ['all', ...new Set(tours.map((tour) => tour.destination?.name).filter(Boolean))];
  const types = ['all', 'wildlife', 'beach', 'adventure', 'cultural', 'photography', 'family'];
  const durations = ['all', '1-3', '4-7', '8-14', '15+'];
  const difficulties = ['all', 'easy', 'moderate', 'challenging', 'difficult'];
  const featuredTours = getFeaturedTours(tours, 3);
  const filteredTours = filterTours(tours, filters);
  const headerImage = getTourImage(featuredTours[0] || tours[0]);
  const featuredCount = tours.filter((tour) => tour.is_featured).length;

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="min-h-screen bg-[#faf8f2]">
      <StaticPageHeader
        title="Tours In Kenya"
        subtitle="Explore 50+ authentic Kenyan experiences from wildlife safaris and beach getaways to cultural adventures and mountain treks."
        bgImage={headerImage}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Catalog</p>
            <p className="mt-2 text-3xl font-serif text-gray-900">{tours.length}</p>
            <p className="mt-2 text-sm text-gray-500">Kenyan tours and experiences available</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Featured</p>
            <p className="mt-2 text-3xl font-serif text-primary-600">{featuredCount}</p>
            <p className="mt-2 text-sm text-gray-500">premium experiences highlighted in the navbar</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Status</p>
            <p className="mt-2 text-3xl font-serif text-gray-900">{loading ? 'Loading' : 'Ready'}</p>
            <p className="mt-2 text-sm text-gray-500">admin tour updates appear here automatically</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <FiSliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Find Your Adventure</h2>
                <p className="text-sm text-gray-500">Start from the navbar hover finder or refine everything here.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Search tours, destinations, or activities..."
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <select
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-4 capitalize focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>

              <select
                value={filters.duration}
                onChange={(event) => updateFilter('duration', event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration === 'all' ? 'Any Duration' : `${duration} Days`}
                  </option>
                ))}
              </select>

              <select
                value={filters.destination}
                onChange={(event) => updateFilter('destination', event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination === 'all' ? 'All Destinations' : destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => updateFilter('difficulty', difficulty)}
                    className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${
                      filters.difficulty === difficulty
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </button>
                ))}
              </div>

              <Button variant="ghost" onClick={resetFilters} className="justify-center">
                Reset Filters
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-[#132026] p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Spotlight</p>
            <h2 className="mt-3 text-2xl font-serif">Popular Kenya Tours</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              These highlight cards share the same catalog the admin editor controls, so updates flow straight through.
            </p>
            <div className="mt-5 space-y-4">
              {featuredTours.map((tour) => (
                <Link
                  key={tour.slug}
                  href={`/tours/${tour.slug}`}
                  className="flex items-center gap-4 rounded-3xl bg-white/10 p-3 transition-colors hover:bg-white/15"
                >
                  <div className="relative h-20 w-24 overflow-hidden rounded-2xl bg-white/10">
                    <Image src={getTourImage(tour)} alt={tour.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{tour.package_code}</p>
                    <h3 className="mt-1 truncate text-base font-semibold text-white">{tour.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{tour.destination?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                      <FiClock className="mr-1" />
                      {tour.duration_days}d
                    </div>
                    <p className="mt-2 text-sm text-white/70">from ${tour.base_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 className="text-3xl font-serif text-gray-900">Tour Catalog</h2>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Showing {filteredTours.length} of {tours.length} authentic Kenyan experiences curated for the discerning traveler.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm text-primary-700 shadow-sm">
            <FiSun className="text-primary-600 animate-pulse" />
            <span className="font-medium">50+ Authentic Experiences Found</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTours.map((tour, index) => (
              <motion.article
                key={tour.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-md transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-72 bg-gray-100 overflow-hidden">
                  <Image 
                    src={getTourImage(tour)} 
                    alt={tour.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider shadow-sm">
                      {tour.difficulty_level}
                    </span>
                    {tour.is_featured && (
                      <span className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-primary-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm font-medium text-white/90">
                          <FiMapPin className="mr-2 text-primary-400" />
                          {tour.destination?.name}
                        </div>
                        <h3 className="text-2xl font-serif font-bold leading-tight line-clamp-2">
                          {tour.name}
                        </h3>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <p className="text-sm leading-relaxed text-gray-600 line-clamp-3 italic">
                    "{tour.short_description}"
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center rounded-2xl bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 border border-gray-100">
                      <FiClock className="mr-2 text-primary-500" />
                      {tour.duration_days} Days
                    </div>
                    {tour.group_size_max && (
                      <div className="flex items-center rounded-2xl bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 border border-gray-100">
                        <FiUsers className="mr-2 text-primary-500" />
                        Up to {tour.group_size_max} Pax
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Total Per Person</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-bold text-primary-600">$</span>
                        <p className="text-3xl font-serif font-black text-primary-600">{tour.base_price}</p>
                      </div>
                    </div>
                    <Link href={`/tours/${tour.slug}`}>
                      <Button variant="outline" className="group/btn rounded-full px-6 border-2 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300">
                        <span className="flex items-center">
                          Explore
                          <FiChevronRight className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredTours.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            No tours match the current filters yet. Reset the filters or try another type, duration, or destination.
          </div>
        )}
      </section>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursPageContent />
    </Suspense>
  );
}