'use client';

/**
 * hotels/[slug]/_client.js  ── CLIENT COMPONENT
 *
 * Receives `slug` and `initialHotel` from the Server Component parent.
 * NO useParams / useRouter used during the server render pass.
 *
 * After mount, fires useHotelCatalog to check for admin overrides.
 * If the admin has updated photos or copy, those replace the seed data.
 *
 * All console output is prefixed [NyleTravel:HotelDetailClient] so you
 * can filter Vercel function logs and browser console in one search.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiAlertCircle,
  FiCheck,
  FiChevronLeft,
  FiClock,
  FiHeart,
  FiInfo,
  FiMapPin,
  FiRefreshCw,
  FiShare2,
  FiStar,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import { getHotelImage, slugifyHotelValue } from '@/lib/hotelCatalog';

const LOG = '[NyleTravel:HotelDetailClient]';

export default function HotelDetailClient({ slug, initialHotel }) {
  const router = useRouter();

  // Start with seed data — zero loading time on first paint
  const [hotel, setHotel] = useState(initialHotel);
  const [notFound, setNotFound] = useState(!initialHotel);

  // Check admin catalog for overrides (runs only in browser)
  const { hotels: adminHotels, loading: adminLoading, error: adminError } = useHotelCatalog(hotelsSeed);

  useEffect(() => {
    if (adminLoading) return;

    if (adminError) {
      console.warn(`${LOG} Admin catalog error (using seed fallback):`, adminError?.message);
      return;
    }

    if (!adminHotels?.length) {
      console.warn(`${LOG} Admin catalog empty — keeping seed hotel.`);
      return;
    }

    const adminMatch = adminHotels.find(
      (h) =>
        slugifyHotelValue(h.slug) === slug ||
        slugifyHotelValue(h.name) === slug
    );

    if (adminMatch) {
      console.info(`${LOG} Admin override found for "${adminMatch.name}" — updating view.`);
      setHotel(adminMatch);
      setNotFound(false);
    } else if (!initialHotel) {
      // Seed had nothing, admin has nothing either
      console.warn(
        `${LOG} No hotel for slug="${slug}". ` +
        `Admin slugs (first 8): [${adminHotels.slice(0, 8).map((h) => h.slug).join(', ')}]`
      );
      setNotFound(true);
    }
  }, [adminLoading, adminHotels, adminError, slug, initialHotel]);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-8">
          <FiAlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Hotel Not Found</h1>
        <p className="text-gray-500 max-w-md mb-2">
          No hotel found for{' '}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{slug}</code>.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          The link may be outdated or the hotel was removed from the catalog.
        </p>
        <Button variant="primary" onClick={() => router.push('/hotels')}>
          Browse All Hotels
        </Button>
      </div>
    );
  }

  // ── Admin catalog still loading & no seed fallback ─────────────────────────
  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-serif italic">Preparing your stay…</p>
      </div>
    );
  }

  // ── Images ─────────────────────────────────────────────────────────────────
  const heroSrc = getHotelImage(hotel);
  const gallery = Array.isArray(hotel.gallery) && hotel.gallery.length > 0
    ? hotel.gallery
    : [heroSrc];

  return (
    <div className="min-h-screen bg-[#faf8f2] pb-24">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/hotels"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 mr-1" />
            Back to Hotels
          </Link>

          {/* Live admin-sync indicator */}
          {adminLoading && (
            <span className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
              Syncing latest details…
            </span>
          )}

          <div className="flex items-center gap-3">
            <button aria-label="Share" className="p-2 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">
              <FiShare2 className="w-5 h-5" />
            </button>
            <button aria-label="Save" className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-600 transition-colors">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 mt-8">

        {/* ── Title ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {hotel.type && (
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 uppercase tracking-wider capitalize">
                {hotel.type}
              </span>
            )}
            {hotel.badge && (
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 uppercase tracking-wider">
                {hotel.badge}
              </span>
            )}
            {(hotel.featuredOnHome || hotel.featured) && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
            {hotel.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-primary-600 shrink-0" />
              {hotel.destination}{hotel.region ? `, ${hotel.region}` : ''}
            </div>
            {hotel.starRating > 0 && (
              <div className="flex items-center gap-1 font-medium text-gray-900 border border-gray-200 px-3 py-1 rounded-full">
                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                {hotel.starRating}.0&nbsp;Stars
              </div>
            )}
          </div>
        </div>

        {/* ── Gallery ── */}
        <div className="mb-12">
          {gallery.length >= 3 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[50vh] md:h-[62vh] rounded-[2rem] overflow-hidden">
              {/* Hero — 2 cols × 2 rows */}
              <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
                <Image
                  src={gallery[0]}
                  alt={hotel.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {[1, 2, 3, 4].map((i) => {
                const src = gallery[i];
                if (!src) {
                  return (
                    <div key={i} className="hidden md:flex bg-[#132026] items-center justify-center">
                      <FiStar className="text-white/10 w-8 h-8" />
                    </div>
                  );
                }
                const isOverlay = i === 4 && gallery.length > 5;
                return (
                  <div key={i} className="hidden md:block relative group cursor-pointer overflow-hidden">
                    <Image
                      src={src}
                      alt={`${hotel.name} — photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isOverlay && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/30 px-4 py-2 rounded-full border border-white/20">
                          +{gallery.length - 5} More
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative h-[55vh] rounded-[2rem] overflow-hidden group">
              <Image
                src={gallery[0]}
                alt={hotel.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left */}
          <div className="lg:col-span-2 space-y-12">

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-4">About this stay</h2>
              <p className="text-gray-600 leading-8 text-lg whitespace-pre-wrap">
                {hotel.description || hotel.shortDescription || 'No description available.'}
              </p>
            </section>

            <hr className="border-gray-200" />

            {hotel.amenities?.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <FiCheck className="w-5 h-5 text-primary-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-8">Things to know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    Check-in &amp; Check-out
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between pb-3 border-b border-gray-50">
                      <span>Check-in</span>
                      <span className="font-semibold text-gray-900">{hotel.checkInTime || '14:00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out</span>
                      <span className="font-semibold text-gray-900">{hotel.checkOutTime || '11:00'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <FiInfo className="w-5 h-5 text-gray-400" />
                    House Rules
                  </h3>
                  <ul className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-sm text-gray-600 list-disc list-inside">
                    {hotel.houseRules?.length > 0
                      ? hotel.houseRules.map((rule, idx) => <li key={idx}>{rule}</li>)
                      : <li>No specific house rules listed.</li>
                    }
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {hotel.cancellationPolicy || 'Standard cancellation policy applies.'}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-7 rounded-[2rem] border border-gray-200 shadow-xl shadow-gray-200/50">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">From</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-gray-900">${hotel.price}</span>
                    <span className="text-gray-400 text-sm">/night</span>
                  </div>
                </div>
                {hotel.starRating > 0 && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <FiStar className="text-yellow-400 fill-current" />
                    {hotel.starRating}.0
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-6 pb-5 border-b border-gray-100">
                Secure your stay at one of Kenya&apos;s finest destinations.
              </p>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center py-4 text-base font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
                  onClick={() => router.push('/contact')}
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center py-4 text-base"
                  onClick={() => router.push('/contact')}
                >
                  Inquire About Stay
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <FiCheck className="text-green-500" />
                No hidden fees · Instant confirmation
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
