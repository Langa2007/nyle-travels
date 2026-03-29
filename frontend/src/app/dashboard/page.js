'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { bookingsAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMap, 
  FiCalendar, 
  FiStar, 
  FiUser, 
  FiSettings, 
  FiBell,
  FiLogOut,
  FiCompass,
  FiShield,
  FiAward,
  FiChevronRight
} from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';

export default function UserDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTours: 0,
    loyaltyPoints: 1250 // Mock loyalty points
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data.bookings || []);
      
      // Calculate stats
      const total = response.data.data.bookings?.length || 0;
      const upcoming = response.data.data.bookings?.filter(b => b.status === 'confirmed').length || 0;
      
      setStats(prev => ({
        ...prev,
        totalBookings: total,
        upcomingTours: upcoming
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Premium Navigation Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-gray-900">
            NYLE<span className="text-primary-600">TRAVEL</span>
          </Link>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-primary-600 font-medium uppercase tracking-widest">Inner Circle Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                {user.image ? (
                  <Image src={user.image} alt={user.first_name} fill className="object-cover" />
                ) : (
                  user.first_name[0]
                )}
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Welcome Hero - High Impact */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1a1a1a] p-12 lg:p-20 text-white min-h-[400px] flex items-center">
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                alt="Safari Sunset" 
                fill 
                className="object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-400 text-sm font-medium tracking-widest uppercase"
              >
                <FiAward className="mr-2" /> Inner Circle Member
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-serif font-bold leading-tight"
              >
                Welcome home,<br />{user.first_name}.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 font-light max-w-lg"
              >
                Where shall we take you next? Your private concierge is ready to craft your next unforgettable luxury experience.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-6"
              >
                <Link href="/tours">
                  <Button variant="primary" size="lg" className="px-10 py-5 text-lg rounded-2xl group shadow-2xl shadow-primary-500/20">
                    Explore New Destinations
                    <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={FiMap} label="Total Travel Days" value="42" color="blue" />
            <StatCard icon={FiCompass} label="Destinations Explored" value={stats.totalBookings || '0'} color="primary" />
            <StatCard icon={FiAward} label="Loyalty Tier" value="Elite Gold" color="amber" />
          </section>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Bookings List (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Your Luxury Itineraries</h2>
                <Link href="/bookings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View All <FiChevronRight className="ml-1" />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
                  <div className="mb-6 flex justify-center text-gray-200">
                    <FiShield size={80} strokeWidth={1} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">No active bookings yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-10">Start your journey into the wild by exploring our extraordinary collection of luxury safaris and retreats.</p>
                  <Link href="/tours">
                    <Button variant="outline" size="lg" className="rounded-xl px-12">Browse Tours</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking, idx) => (
                    <BookingCard key={booking.id} booking={booking} index={idx} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Inner Circle Benefits</h2>
              
              <div className="space-y-4">
                <BenefitCard 
                  title="Priority Booking" 
                  desc="Early access to limited safari group departures."
                  icon={FiStar}
                />
                <BenefitCard 
                  title="Private Concierge" 
                  desc="Direct line to our travel experts for 24/7 assistance."
                  icon={FiUser} 
                />
                <BenefitCard 
                  title="Lounge Access" 
                  desc="Complimentary access to premium lounges at major Kenya airports."
                  icon={FiAward}
                />
              </div>

              {/* Personal Recommendation Widget */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <FiMap size={120} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Editor's Choice</h3>
                <p className="text-sm text-gray-500 mb-6">Based on your preference for tranquil retreats</p>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                   <Image 
                    src="https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Luxury Lodge" 
                    fill 
                    className="object-cover"
                   />
                </div>
                <h4 className="font-bold text-gray-900">Mara Sopa Lodge Retreat</h4>
                <p className="text-sm text-gray-500 mb-4">3 Days • Full Board • Spa Inclusive</p>
                <Link href="/tours/mara-sopa" className="block">
                  <Button variant="primary" fullWidth className="rounded-xl">Learn More</Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'text-primary-600 bg-primary-50',
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50'
  };
  
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-serif font-bold text-gray-900 mt-2 tracking-tight">{value}</h3>
    </div>
  );
}

function BenefitCard({ title, desc, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start space-x-4 hover:border-primary-200 transition-colors group cursor-pointer shadow-sm">
      <div className="p-2 rounded-lg bg-gray-50 text-primary-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking, index }) {
  const statusColors = {
    confirmed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden group"
    >
      <div className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
        <Image 
          src={booking.tour_image || "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={booking.tour_name || "Tour Image"} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-2 left-2">
           <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[booking.status || 'confirmed']}`}>
            {booking.status || 'Verified'}
           </span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center text-primary-600 text-[10px] font-bold uppercase tracking-widest">
           <FiCalendar className="mr-1" /> Booking Ref: #{booking.booking_number || 'NYL-2401'}
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
          {booking.tour_name || 'Amboseli Cloud Gazing Safari'}
        </h3>
        <p className="text-gray-500 font-light max-w-md">
          {new Date(booking.start_date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {booking.guests || '2'} Travelers
        </p>
      </div>

      <div className="flex-shrink-0">
        <Button variant="ghost" className="text-primary-600 font-bold group-hover:bg-primary-50 px-6 py-3 rounded-xl transition-all">
          Manage Itinerary
        </Button>
      </div>
    </motion.div>
  );
}
