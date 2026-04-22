'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  FiMapPin,
  FiStar,
  FiCheck,
  FiClock,
  FiInfo,
  FiChevronLeft,
  FiShare2,
  FiHeart,
  FiX,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import { getHotelImage, slugifyHotelValue } from '@/lib/hotelCatalog';

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = params?.slug ?? '';
  // Normalise slug so spaces or encoding variants still match
  const slug = slugifyHotelValue(decodeURIComponent(rawSlug));

  const { hotels, loading } = useHotelCatalog(hotelsSeed);
  const [hotel, setHotel] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;
    const found = hotels.find(
      (h) => slugifyHotelValue(h.slug) === slug || slugifyHotelValue(h.name) === slug
    );
    if (found) {
      setHotel(found);
    } else {
      setNotFound(true);
    }
  }, [loading, hotels, slug]);

  /* ── Loading ── */
  if (loading || (!hotel && !notFound)) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-serif italic">Preparing your stay…</p>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-8">
          <FiX size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Hotel Not Found</h1>
        <p className="text-gray-500 max-w-md mb-8">
          We couldn&apos;t find a hotel matching that listing. Browse all available Kenya stays below.
        </p>
        <Button variant="primary" onClick={() => router.push('/hotels')}>
          Back to Hotels
        </Button>
      </div>
    );
  }

  const images =
    Array.isArray(hotel.gallery) && hotel.gallery.length > 0
      ? hotel.gallery
      : [getHotelImage(hotel)];

  return (
    <div className="min-h-screen bg-[#faf8f2] pb-24">

      {/* ── Breadcrumb Nav ── */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/hotels"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 mr-1" />
            Back to Hotels
          </Link>
          <div className="flex items-center gap-3">
            <button
              aria-label="Share hotel"
              className="p-2 rounded-full hover:bg-gray-50 flex items-center text-gray-600 transition-colors"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
            <button
              aria-label="Save hotel"
              className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center text-gray-600 transition-colors"
            >
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <main className="container mx-auto px-4 mt-8">

        {/* ── Title ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 uppercase tracking-wider capitalize">
              {hotel.type}
            </span>
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
              {hotel.destination}, {hotel.region}
            </div>
            <div className="flex items-center gap-1 font-medium text-gray-900 border border-gray-200 px-3 py-1 rounded-full">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              {hotel.starRating}.0&nbsp;Stars
            </div>
          </div>
        </div>

        {/* ── Gallery ── */}
        <div className="mb-12">
          {images.length >= 3 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[50vh] md:h-[62vh] rounded-[2rem] overflow-hidden">
              {/* Hero – spans 2 cols & 2 rows */}
              <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
                <Image
                  src={images[0]}
                  alt={hotel.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Grid tiles */}
              {[1, 2, 3, 4].map((i) => {
                const src = images[i];
                if (!src) {
                  return (
                    <div key={i} className="hidden md:flex bg-[#132026] items-center justify-center">
                      <FiStar className="text-white/10 w-10 h-10" />
                    </div>
                  );
                }
                const isLast = i === 4 && images.length > 5;
                return (
                  <div key={i} className="hidden md:block relative group cursor-pointer overflow-hidden">
                    <Image
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full text-sm border border-white/20">
                          +{images.length - 5} More
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
                src={images[0]}
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

          {/* ── Left: Details ── */}
          <div className="lg:col-span-2 space-y-12">

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-4">About this stay</h2>
              <p className="text-gray-600 leading-8 text-lg whitespace-pre-wrap">{hotel.description}</p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <FiCheck className="w-5 h-5 text-primary-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-8">Things to know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Check-in/out */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    Check-in &amp; Check-out
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Check-in</span>
                      <span className="font-semibold text-gray-900">{hotel.checkInTime || '14:00'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-50 pt-3">
                      <span>Check-out</span>
                      <span className="font-semibold text-gray-900">{hotel.checkOutTime || '11:00'}</span>
                    </div>
                  </div>
                </div>

                {/* House Rules */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <FiInfo className="w-5 h-5 text-gray-400" />
                    House Rules
                  </h3>
                  <ul className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-sm text-gray-600 list-disc list-inside">
                    {hotel.houseRules?.length > 0
                      ? hotel.houseRules.map((rule, idx) => <li key={idx}>{rule}</li>)
                      : <li>No specific house rules listed.</li>}
                  </ul>
                </div>

              </div>

              {/* Cancellation */}
              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {hotel.cancellationPolicy || 'Standard cancellation policy applies. Please check during your booking process for the full terms.'}
                </p>
              </div>
            </section>

          </div>

          {/* ── Right: Booking Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-7 rounded-[2rem] border border-gray-200 shadow-xl shadow-gray-200/50">

              {/* Price */}
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">From</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-gray-900">
                      ${hotel.price}
                    </span>
                    <span className="text-gray-400 text-sm">/night</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <FiStar className="text-yellow-400 fill-current" />
                  {hotel.starRating}.0
                </div>
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
