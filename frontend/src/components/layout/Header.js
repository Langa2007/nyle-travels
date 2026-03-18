'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiUser, 
  FiShoppingBag, 
  FiHeart,
  FiChevronDown 
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Button from '@/components/ui/Button';

const navItems = [
  { label: 'Home', href: '/' },
  { 
    label: 'Tours', 
    href: '/tours',
    megaMenu: true,
  },
  { 
    label: 'Hotels', 
    href: '/hotels',
    megaMenu: true,
  },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
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
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.svg"
                    alt="Nyle Travel"
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className={`font-serif text-xl font-bold transition-colors ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  Nyle<span className="text-primary-500">Travel</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-500 flex items-center ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  } ${pathname === item.href ? 'text-primary-500' : ''}`}
                >
                  {item.label}
                  {item.megaMenu && <FiChevronDown className="ml-1" />}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiSearch size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 relative ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 relative ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
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
                    variant={isScrolled ? 'primary' : 'outline-white'}
                    size="sm"
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
      </header>

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
                    placeholder="Search destinations, tours, hotels..."
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
                <div className="mb-8 space-y-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" fullWidth>
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

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 text-gray-700 hover:text-primary-500 font-medium border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
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