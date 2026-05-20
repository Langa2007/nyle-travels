'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiHome } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/common/DatePicker';
import { defaultHeroSlides, normalizeHeroSlides } from '@/data/heroSlides';
import { fetchSettings } from '@/utils/settings';
import { destinationsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import useHotelCatalog from '@/hooks/useHotelCatalog';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    date: null,
    guests: 2,
  });

  const router = useRouter();
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [destinations, setDestinations] = useState([]);
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { hotels } = useHotelCatalog([], { allowSeedFallback: false });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, destinationsData] = await Promise.all([
          fetchSettings('hero_sections'),
          destinationsAPI.getAll()
        ]);
        console.log('[HERO] Raw settings data:', settingsData);
        const normalized = normalizeHeroSlides(settingsData);
        console.log('[HERO] Normalized slides:', normalized);
        setHeroSlides(normalized);
        if (destinationsData && destinationsData.data) {
          const rawData = destinationsData.data;
          if (rawData.data && Array.isArray(rawData.data.destinations)) {
            setDestinations(rawData.data.destinations);
          } else if (rawData.data && Array.isArray(rawData.data)) {
            setDestinations(rawData.data);
          } else if (Array.isArray(rawData)) {
            setDestinations(rawData);
          } else if (rawData.destinations && Array.isArray(rawData.destinations)) {
            setDestinations(rawData.destinations);
          }
        }
      } catch (error) {
        console.error('[HERO] Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // 30 Seconds timeframe
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Consolidate destinations and hotels into searchable list
  const searchableItems = [
    ...(Array.isArray(destinations) ? destinations : []).map(d => ({
      id: `dest-${d.id || d.slug}`,
      name: d.name,
      slug: d.slug,
      type: 'destination',
      subtitle: `${d.region ? d.region + ', ' : ''}${d.country || 'Kenya'}`,
      bestTimeToVisit: d.best_time_to_visit || d.bestTimeToVisit || ''
    })),
    ...(Array.isArray(hotels) ? hotels : []).map(h => ({
      id: `hotel-${h.slug}`,
      name: h.name,
      slug: h.slug,
      type: 'hotel',
      subtitle: `Hotel in ${h.destination || 'Kenya'}`,
      bestTimeToVisit: ''
    }))
  ];

  const getFilteredItems = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    // Filter by name or subtitle (case-insensitive)
    const filtered = searchableItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query)
    );

    // Sort items: items whose names start with the query appear first
    return filtered.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(query);
      const bStarts = b.name.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const filteredItems = getFilteredItems();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsDropdownOpen(true);
    
    // Clear selection if query changes
    if (selectedItem && val !== selectedItem.name) {
      setSelectedItem(null);
      setBestTimeToVisit('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <section className="relative h-screen w-full z-40">
      {/* Background Slides */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

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
            className="max-w-5xl mx-auto relative z-30"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="relative search-dropdown-container md:col-span-6">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10" />
                  <input
                    type="text"
                    placeholder="Type destination or hotel..."
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto z-50 p-2 scrollbar-thin">
                      {searchQuery.trim() === '' ? (
                        <div className="p-4 text-center text-gray-400 text-sm italic">
                          Type to search destinations or hotels...
                        </div>
                      ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-[#f7f3ea] active:bg-[#ede8db]"
                            onClick={() => {
                              setSelectedItem(item);
                              setSearchQuery(item.name);
                              setIsDropdownOpen(false);
                              if (item.type === 'destination' && item.bestTimeToVisit) {
                                setBestTimeToVisit(item.bestTimeToVisit);
                              } else {
                                setBestTimeToVisit('');
                              }
                            }}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${
                              item.type === 'destination' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {item.type === 'destination' ? (
                                <FiMapPin className="w-4 h-4" />
                              ) : (
                                <FiHome className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              item.type === 'destination'
                                ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50'
                                : 'bg-amber-50/50 text-amber-700 border-amber-200/50'
                            }`}>
                              {item.type}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-5 text-center text-gray-500 text-sm">
                          <p className="font-medium text-gray-700 mb-1">Sorry, no matching destination or hotel found.</p>
                          <p className="text-xs text-gray-400">Please try looking for something else!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative w-full z-50 md:col-span-3">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10" />
                  <DatePicker
                    selected={searchParams.date}
                    onChange={(date) => setSearchParams({ ...searchParams, date })}
                    minDate={new Date()}
                    placeholderText={bestTimeToVisit ? `Best time: ${bestTimeToVisit}` : "Select Date"}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    renderCustomHeader={({
                      date,
                      changeYear,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          type="button"
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className={`p-1 rounded-full ${prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 text-gray-800'}`}
                        >
                          {'<'}
                        </button>
                        <div className="font-semibold text-gray-800">
                          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-800"
                          >
                            {'>'}
                          </button>
                          <button
                            type="button"
                            onClick={() => changeYear(date.getFullYear() + 1)}
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-800 font-bold"
                            title="Next Year"
                          >
                            {'>>'}
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div className="relative md:col-span-1">
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

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full group relative overflow-hidden md:col-span-2"
                  onClick={() => {
                    let activeItem = selectedItem;

                    // If no item is selected but there is query text, try to find a match
                    if (!activeItem && searchQuery.trim() !== '') {
                      const matches = getFilteredItems();
                      if (matches.length > 0) {
                        activeItem = matches[0];
                        setSelectedItem(activeItem);
                        setSearchQuery(activeItem.name);
                        if (activeItem.type === 'destination' && activeItem.bestTimeToVisit) {
                          setBestTimeToVisit(activeItem.bestTimeToVisit);
                        }
                      }
                    }

                    if (!activeItem) {
                      alert("Please type and select a destination or hotel!");
                      return;
                    }

                    const dateStr = searchParams.date ? `date=${encodeURIComponent(searchParams.date.toISOString())}` : '';
                    
                    if (activeItem.type === 'destination') {
                      const route = dateStr ? `/destinations?${dateStr}#${activeItem.slug}` : `/destinations#${activeItem.slug}`;
                      router.push(route);
                    } else if (activeItem.type === 'hotel') {
                      const route = dateStr ? `/hotels/${activeItem.slug}?${dateStr}` : `/hotels/${activeItem.slug}`;
                      router.push(route);
                    }
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Search
                    <FiSearch className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
            {Array.isArray(heroSlides) && heroSlides.map((_, index) => (
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
