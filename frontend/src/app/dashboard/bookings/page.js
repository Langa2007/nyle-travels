'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiMap, FiShield } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { bookingsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-32">
        <Loader />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-28">
        <section className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <FiShield className="mx-auto mb-4 text-primary-500" size={44} />
          <h1 className="font-serif text-3xl font-bold text-gray-900">Sign in to view bookings</h1>
          <p className="mt-2 text-gray-600">Your travel plans are saved inside your account.</p>
          <Link href="/login" className="mt-8 inline-flex">
            <Button>Sign in</Button>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gray-900">My bookings</h1>
          <p className="mt-2 text-gray-600">Track and manage your Nyle Travel itineraries.</p>
        </div>

        {bookings.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <FiCalendar className="mx-auto mb-4 text-primary-500" size={44} />
            <h2 className="font-serif text-2xl font-bold text-gray-900">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">When you book a tour, your itinerary will appear here.</p>
            <Link href="/tours" className="mt-8 inline-flex">
              <Button>Explore tours</Button>
            </Link>
          </section>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article key={booking.id || booking.booking_number} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:flex">
                <div className="relative h-56 sm:h-auto sm:w-64 sm:flex-shrink-0">
                  <Image
                    src={booking.tour_image || '/images/hotel-placeholder.svg'}
                    alt={booking.tour_name || 'Booking'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div>
                    <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700">
                      {booking.status || 'pending'}
                    </span>
                    <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900">{booking.tour_name || 'Nyle Travel booking'}</h2>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2"><FiCalendar /> {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'Date pending'}</span>
                      <span className="inline-flex items-center gap-2"><FiMap /> {booking.destination || booking.location || 'Destination pending'}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Booking ref: {booking.booking_number || booking.id}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
