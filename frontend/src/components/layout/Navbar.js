'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiHeart, 
  FiShoppingBag,
  FiSearch,
  FiChevronDown
} from 'react-icons/fi';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { 
    href: '/tours', 
    label: 'Tours',
    megaMenu: [
      {
        title: 'By Interest',
        links: [
          { href: '/tours?type=wildlife', label: 'Wildlife Safaris' },
          { href: '/tours?type=beach', label: 'Beach Holidays' },
          { href: '/tours?type=adventure', label: 'Adventure Tours' },
          { href: '/tours?type=cultural', label: 'Cultural Experiences' },
          { href: '/tours?type=photography', label: 'Photography Safaris' },
          { href: '/tours?type=family', label: 'Family Friendly' },
        ]
      },
      {
        title: 'By Duration',
        links: [
          { href: '/tours?duration=3', label: '3-5 Days' },
          { href: '/tours?duration=7', label: '1 Week' },
          { href: '/tours?duration=10', label: '10 Days' },
          { href: '/tours?duration=14', label: '2 Weeks' },
          { href: '/tours?duration=21', label: '3 Weeks+' },
        ]
      },
      {
        title: 'Featured',
        links: [
          { href: '/tours/featured', label: 'Premium Collection' },
          { href: '/tours/luxury', label: 'Ultra-Luxury' },
          { href: '/tours/best-sellers', label: 'Best Sellers' },
          { href: '/tours/special-offers', label: 'Special Offers' },
        ]
      },
      {
        title: 'By Destination',
        links: [
          { href: '/destinations#maasai-mara', label: 'Maasai Mara' },
          { href: '/destinations#diani-beach', label: 'Diani Beach' },
          { href: '/destinations#amboseli', label: 'Amboseli' },
          { href: '/destinations#tsavo-east', label: 'Tsavo' },
          { href: '/destinations#lake-nakuru', label: 'Lake Nakuru' },
        ]
      }
    ]
  },
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
        ]
      },
      {
        title: 'By Rating',
        links: [
          { href: '/hotels?rating=5', label: '5 Star' },
          { href: '/hotels?rating=4', label: '4 Star' },
          { href: '/hotels?rating=3', label: '3 Star' },
        ]
      },
      {
        title: 'Amenities',
        links: [
          { href: '/hotels?amenity=spa', label: 'Spa & Wellness' },
          { href: '/hotels?amenity=pool', label: 'Infinity Pools' },
          { href: '/hotels?amenity=fine-dining', label: 'Fine Dining' },
          { href: '/hotels?amenity=private-pool', label: 'Private Pools' },
          { href: '/hotels?amenity=beachfront', label: 'Beachfront' },
        ]
      }
    ]
  },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

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

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <div className="flex items-center space-x-2">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logo.svg"
                    alt="Nyle Travel"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className={`font-serif text-2xl font-bold transition-colors ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Nyle<span className="text-primary-500">Travel</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.megaMenu && setActiveMegaMenu(link.label)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-500 ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    } ${pathname === link.href ? 'text-primary-500' : ''}`}
                  >
                    <span>{link.label}</span>
                    {link.megaMenu && <FiChevronDown className="ml-1" />}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {link.megaMenu && activeMegaMenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-4 gap-6"
                      >
                        {link.megaMenu.map((column, idx) => (
                          <div key={idx}>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                              {column.title}
                            </h3>
                            <ul className="space-y-2">
                              {column.links.map((subLink) => (
                                <li key={subLink.href}>
                                  <Link
                                    href={subLink.href}
                                    className="text-sm text-gray-600 hover:text-primary-500 transition-colors"
                                  >
                                    {subLink.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiSearch size={20} />
              </button>

              <Link
                href="/wishlist"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 relative ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 relative ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <FiChevronDown className={`${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
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

            {/* Mobile Menu Button */}
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

      {/* Search Overlay */}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for destinations, tours, hotels..."
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <span className="font-serif text-2xl font-bold text-gray-900">
                    Nyle<span className="text-primary-500">Travel</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              {!user && (
                <div className="mb-8">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" fullWidth className="mb-3">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              {user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    {link.megaMenu ? (
                      <div className="border-b border-gray-100 py-2">
                        <p className="font-semibold text-gray-900 mb-2">{link.label}</p>
                        <div className="grid grid-cols-2 gap-4 ml-4">
                          {link.megaMenu.map((column) => (
                            <div key={column.title}>
                              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                                {column.title}
                              </h4>
                              <ul className="space-y-2">
                                {column.links.map((subLink) => (
                                  <li key={subLink.href}>
                                    <Link
                                      href={subLink.href}
                                      className="text-sm text-gray-600 hover:text-primary-500"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {subLink.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-3 text-gray-700 hover:text-primary-500 font-medium border-b border-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {user && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Wishlist ({wishlistCount})
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
