'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import {
  FiMenu,
  FiX,
  FiHeart,
  FiShoppingBag,
  FiSearch,
  FiChevronDown,
  FiMapPin,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import {
  buildHotelQuery,
  getFeaturedHotels,
  getHotelImage,
} from '@/lib/hotelCatalog';

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/hotels',
    label: 'Hotels',
    megaMenu: [
      {
        title: 'By Category',
        links: [
          { href: '/hotels?type=luxury', label: 'Luxury Resorts' },
          { href: '/hotels?type=boutique', label: 'Boutique Hotels' },
          { href: '/hotels?type=beach', label: 'Beach Resorts' },
          { href: '/hotels?type=safari', label: 'Safari Lodges' },
          { href: '/hotels?type=wellness', label: 'Wellness Retreats' },
        ],
      },
      {
        title: 'By Rating',
        links: [
          { href: '/hotels?rating=5', label: '5 Star' },
          { href: '/hotels?rating=4', label: '4 Star & Up' },
          { href: '/hotels?rating=3', label: '3 Star & Up' },
        ],
      },
      {
        title: 'Amenities',
        links: [
          { href: '/hotels?amenity=spa', label: 'Spa & Wellness' },
          { href: '/hotels?amenity=pool', label: 'Infinity Pools' },
          { href: '/hotels?amenity=fine-dining', label: 'Fine Dining' },
          { href: '/hotels?amenity=game-drives', label: 'Game Drives' },
          { href: '/hotels?amenity=beach-access', label: 'Beach Access' },
        ],
      },
      {
        title: 'Popular Destinations',
        links: [
          { href: '/hotels?destination=Maasai%20Mara', label: 'Maasai Mara' },
          { href: '/hotels?destination=Diani%20Beach', label: 'Diani Beach' },
          { href: '/hotels?destination=Nairobi', label: 'Nairobi' },
          { href: '/hotels?destination=Watamu', label: 'Watamu' },
          { href: '/hotels?destination=Naivasha', label: 'Naivasha' },
        ],
      },
    ],
  },
  {
    href: '/tours',
    label: 'Tours',
    megaMenu: [
      {
        title: 'By Style',
        links: [
          { href: '/tours?difficulty=easy', label: 'Family Expeditions' },
          { href: '/tours?difficulty=moderate', label: 'Cultural Discoveries' },
          { href: '/tours?difficulty=challenging', label: 'Wilderness Treks' },
          { href: '/tours?difficulty=difficult', label: 'Extreme Adventures' },
        ],
      },
      {
        title: 'By Duration',
        links: [
          { href: '/tours?minDuration=1&maxDuration=5', label: 'Quick Escapes' },
          { href: '/tours?minDuration=6&maxDuration=10', label: 'Standard Voyages' },
          { href: '/tours?minDuration=11', label: 'Grand Expeditions' },
        ],
      },
      {
        title: 'Specialty',
        links: [
          { href: '/tours?isFeatured=true', label: 'Signature Series' },
          { href: '/tours?sort=views_count', label: 'Trending Journeys' },
          { href: '/tours?sort=base_price&order=ASC', label: 'Value Collections' },
        ],
      },
      {
        title: 'Top Regions',
        links: [
          { href: '/tours?destination=maasai-mara', label: 'The Mara' },
          { href: '/tours?destination=diani-beach', label: 'Coastal Luxury' },
          { href: '/tours?destination=amboseli', label: 'Kilimanjaro Views' },
        ],
      },
    ],
  },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const hotelTypeOptions = ['luxury', 'boutique', 'beach', 'safari', 'wellness', 'city'];
const hotelAmenityOptions = ['spa', 'pool', 'fine-dining', 'beach-access', 'game-drives'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  
  const [hotelFinder, setHotelFinder] = useState({
    search: '',
    destination: '',
    type: '',
    amenity: '',
  });

  const { hotels } = useHotelCatalog([], { allowSeedFallback: false });
  const featuredHotels = getFeaturedHotels(hotels, 3);
  const hotelDestinations = [...new Set(hotels.map((hotel) => hotel.destination).filter(Boolean))].slice(0, 6);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  function updateHotelFinder(field, value) {
    setHotelFinder((current) => ({
      ...current,
      [field]: current[field] === value ? '' : value,
    }));
  }

  function goToHotelSearch(overrides = {}) {
    const nextFilters = {
      ...hotelFinder,
      ...overrides,
    };
    const query = buildHotelQuery(nextFilters);
    setActiveMegaMenu(null);
    router.push(query ? `/hotels?${query}` : '/hotels');
  }

  function handleHotelFinderSubmit(event) {
    event.preventDefault();
    goToHotelSearch();
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled ? 'pt-4' : 'pt-0'
        }`}
      >
        <div 
          className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isScrolled 
              ? 'max-w-5xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[2rem] px-8 py-3' 
              : 'max-w-full bg-transparent px-8 py-6'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="relative z-10 group overflow-hidden">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 p-[2px]"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                >
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Image
                      src="/images/logo.svg"
                      alt="Nyle Travel"
                      fill
                      className="object-contain p-1.5"
                      priority
                    />
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className={`font-serif text-xl font-bold leading-none tracking-tight transition-colors duration-500 ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}>
                    Nyle<span className="text-primary-500">Travel</span>
                  </span>
                  <span className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${
                    isScrolled ? 'text-gray-500 font-bold' : 'text-white/60'
                  }`}>
                    & Tours
                  </span>
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-2 relative">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative px-4 py-2"
                  onMouseEnter={() => {
                    setActiveMegaMenu(link.label);
                  }}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`relative z-10 flex items-center space-x-1 text-sm font-semibold transition-colors duration-500 ${
                      activeMegaMenu === link.label || pathname === link.href
                        ? 'text-primary-500'
                        : isScrolled ? 'text-gray-600' : 'text-white/90'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.megaMenu && (
                      <motion.span
                        animate={{ rotate: activeMegaMenu === link.label ? 180 : 0 }}
                      >
                        <FiChevronDown className="ml-0.5 w-3 h-3" />
                      </motion.span>
                    )}
                  </Link>

                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary-50/80 rounded-full -z-0"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}

                  <AnimatePresence>
                    {link.megaMenu && activeMegaMenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`absolute top-full -left-20 mt-4 rounded-[2rem] bg-white/90 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden ${
                          link.label === 'Hotels' ? 'w-[1000px]' : 'w-[640px]'
                        }`}
                      >
                        {/* Decorative background element for mega menu */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <motion.div 
                          className={`relative z-10 grid gap-10 ${
                            link.label === 'Hotels' ? 'grid-cols-[repeat(4,minmax(0,1fr))_1.5fr]' : 'grid-cols-4'
                          }`}
                          variants={{
                            hidden: { opacity: 0 },
                            show: {
                              opacity: 1,
                              transition: { staggerChildren: 0.05 }
                            }
                          }}
                          initial="hidden"
                          animate="show"
                        >
                          {link.megaMenu.map((column) => (
                            <motion.div 
                              key={column.title}
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 }
                              }}
                            >
                              <h3 className="mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{column.title}</h3>
                              <ul className="space-y-3">
                                {column.links.map((subLink) => (
                                  <li key={subLink.href}>
                                    <Link
                                      href={subLink.href}
                                      className="inline-flex items-center group/link text-sm font-medium text-gray-700 transition-all hover:text-primary-600"
                                    >
                                      <span className="relative">
                                        {subLink.label}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover/link:w-full" />
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}

                          {link.label === 'Hotels' && (
                            <motion.div 
                              variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                show: { opacity: 1, scale: 1 }
                              }}
                              className="rounded-[2rem] bg-gray-950 p-6 text-white shadow-2xl relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
                              
                              <p className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-bold text-primary-400">
                                Smart Finder
                              </p>
                              <h3 className="relative z-10 mt-3 text-xl font-serif font-bold italic">Curate your perfect stay</h3>
                              
                              <form 
                                onSubmit={handleHotelFinderSubmit} 
                                className="relative z-10 mt-6 space-y-3"
                              >
                                <div>
                                  <input
                                    type="text"
                                    value={hotelFinder.search}
                                    onChange={(event) => updateHotelFinder('search', event.target.value)}
                                    placeholder="Where to?"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                  />
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  <select
                                    value={hotelFinder.type}
                                    onChange={(event) => updateHotelFinder('type', event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none"
                                  >
                                    <option value="" className="text-gray-900">All Styles</option>
                                    {hotelTypeOptions.map((type) => (
                                      <option key={type} value={type} className="text-gray-900 uppercase tracking-tighter">
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <Button type="submit" variant="primary" fullWidth className="!rounded-2xl !py-3 font-bold uppercase tracking-widest text-xs">
                                  Search Hotels
                                </Button>
                              </form>
                              
                              <div className="relative z-10 mt-6 space-y-3 pt-6 border-t border-white/10">
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Editor's Choice</p>
                                {featuredHotels.slice(0, 2).map((hotel) => (
                                  <button
                                    key={hotel.slug}
                                    type="button"
                                    onClick={() => goToHotelSearch({ destination: hotel.destination, search: hotel.name })}
                                    className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-2 text-left transition-all hover:bg-white/10 group/item"
                                  >
                                    <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                                      <Image src={getHotelImage(hotel)} alt={hotel.name} fill className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs font-bold text-white">{hotel.name}</p>
                                      <p className="mt-0.5 flex items-center text-[10px] text-white/50 font-medium">
                                        <FiMapPin className="mr-1" />
                                        {hotel.destination}
                                      </p>
                                    </div>
                                    <FiChevronDown className="text-white/30 -rotate-90" size={14} />
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <div className={`flex items-center p-1 rounded-full transition-all duration-500 ${
                isScrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                    isScrolled ? 'text-gray-700 hover:bg-white hover:shadow-sm' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FiSearch size={18} />
                </button>

                <Link
                  href="/wishlist"
                  className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 relative ${
                    isScrolled ? 'text-gray-700 hover:bg-white hover:shadow-sm' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FiHeart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 relative ${
                    isScrolled ? 'text-gray-700 hover:bg-white hover:shadow-sm' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FiShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="h-8 w-px bg-gray-200/50 mx-2" />

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <FiChevronDown className={`${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Bookings
                    </Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    variant={isScrolled ? 'primary' : 'outline'}
                    size="sm"
                    className="!px-6"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="container mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for destinations or hotels..."
                    className="w-full py-4 pr-12 text-lg border-b-2 border-gray-200 focus:border-primary-500 outline-none"
                    autoFocus
                  />
                  <FiSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
                </div>
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">POPULAR SEARCHES</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Maasai Mara', 'Diani Beach', 'Luxury Safari', 'Beach Resort', 'Honeymoon'].map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${term}`}
                        className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-primary-500 hover:text-white transition-colors"
                        onClick={() => setSearchOpen(false)}
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/40 backdrop-blur-2xl z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col h-full bg-white/95 backdrop-blur-xl p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" onClick={() => setIsOpen(false)} className="group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 p-[2px]">
                      <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                        <Image src="/images/logo.svg" alt="Logo" width={24} height={24} />
                      </div>
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight">Nyle Travel</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-900 border border-black/5"
                >
                  <FiX size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                <motion.div 
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                    >
                      <Link
                        href={link.href}
                        className="block text-4xl font-serif font-bold text-gray-900 tracking-tight transition-all active:scale-95"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {link.megaMenu && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {link.megaMenu.flatMap(col => col.links).slice(0, 4).map(sub => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500"
                              onClick={() => setIsOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </nav>

              <div className="mt-auto py-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex space-x-4">
                    <Link href="/wishlist" className="relative p-2" onClick={() => setIsOpen(false)}>
                      <FiHeart size={24} />
                      {wishlistCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
                    </Link>
                    <Link href="/cart" className="relative p-2" onClick={() => setIsOpen(false)}>
                      <FiShoppingBag size={24} />
                      {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 rounded-full border-2 border-white" />}
                    </Link>
                  </div>

                  {user ? (
                    <button onClick={logout} className="text-sm font-bold uppercase tracking-widest text-red-500">Sign Out</button>
                  ) : (
                    <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-primary-500">Sign In</Link>
                  )}
                </div>
                
                <Button variant="primary" fullWidth className="!rounded-2xl !py-5 text-sm uppercase tracking-[0.2em] font-bold">
                  Book a Consult
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
