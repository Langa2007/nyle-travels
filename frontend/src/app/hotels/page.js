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
} from 'react-icons/fi';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import {
  filterHotels,
  getFeaturedHotels,
  getHotelImage,
} from '@/lib/hotelCatalog';

const defaultFilters = {
  search: '',
  destination: 'all',
  type: 'all',
  rating: 'all',
  amenity: 'all',
};

function HotelsPageContent() {
  const searchParams = useSearchParams();
  const { hotels, loading } = useHotelCatalog(hotelsSeed);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      destination: searchParams.get('destination') || 'all',
      type: searchParams.get('type') || 'all',
      rating: searchParams.get('rating') || 'all',
      amenity: searchParams.get('amenity') || 'all',
    });
  }, [searchParams]);

  const destinations = ['all', ...new Set(hotels.map((hotel) => hotel.destination).filter(Boolean))];
  const types = ['all', ...new Set(hotels.map((hotel) => hotel.type).filter(Boolean))];
  const amenities = ['all', ...new Set(hotels.flatMap((hotel) => hotel.amenities).filter(Boolean))].slice(0, 16);
  const featuredHotels = getFeaturedHotels(hotels, 3);
  const filteredHotels = filterHotels(hotels, filters);
  const headerImage = getHotelImage(featuredHotels[0] || hotels[0]);
  const featuredCount = hotels.filter((hotel) => hotel.featuredOnHome || hotel.featured).length;

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
        title="Hotels In Kenya"
        subtitle="Browse 80+ hand-picked Kenya stays across city escapes, beach retreats, and safari lodges, then refine by destination, style, rating, or amenity."
        bgImage={headerImage}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Catalog</p>
            <p className="mt-2 text-3xl font-serif text-gray-900">{hotels.length}</p>
            <p className="mt-2 text-sm text-gray-500">Kenya hotels and lodges currently available on the page</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Featured</p>
            <p className="mt-2 text-3xl font-serif text-primary-600">{featuredCount}</p>
            <p className="mt-2 text-sm text-gray-500">signature stays surfaced in the navbar and homepage</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Status</p>
            <p className="mt-2 text-3xl font-serif text-gray-900">{loading ? 'Syncing' : 'Ready'}</p>
            <p className="mt-2 text-sm text-gray-500">admin hotel updates appear here after the catalog loads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <FiSliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Find Your Stay</h2>
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
                  placeholder="Search by hotel, destination, or amenity..."
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

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

              <select
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-4 capitalize focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Styles' : type}
                  </option>
                ))}
              </select>

              <select
                value={filters.rating}
                onChange={(event) => updateFilter('rating', event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Any Rating</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star & Up</option>
                <option value="3">3 Star & Up</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => updateFilter('amenity', amenity)}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
                      filters.amenity === amenity
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity === 'all' ? 'All Amenities' : amenity}
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
            <h2 className="mt-3 text-2xl font-serif">Popular Kenya Stays</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              These highlight cards share the same catalog the admin editor controls, so image overrides and copy updates flow straight through.
            </p>
            <div className="mt-5 space-y-4">
              {featuredHotels.map((hotel) => (
                <Link
                  key={hotel.slug}
                  href={`/hotels/${hotel.slug}`}
                  className="flex items-center gap-4 rounded-3xl bg-white/10 p-3 transition-colors hover:bg-white/15"
                >
                  <div className="relative h-20 w-24 overflow-hidden rounded-2xl bg-white/10">
                    <Image src={getHotelImage(hotel)} alt={hotel.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{hotel.badge}</p>
                    <h3 className="mt-1 truncate text-base font-semibold text-white">{hotel.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{hotel.destination}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                      <FiStar className="mr-1 text-yellow-300" />
                      {hotel.starRating}.0
                    </div>
                    <p className="mt-2 text-sm text-white/70">from ${hotel.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">Hotel Catalog</h2>
            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredHotels.length} of {hotels.length} Kenya stays matching the current filters.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            <FiSun className="text-primary-600" />
            Search links from the navbar open this page pre-filtered.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <article
              key={hotel.slug}
              className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-64 bg-gray-100">
                <Image src={getHotelImage(hotel)} alt={hotel.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 capitalize">
                    {hotel.type}
                  </span>
                  <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                    {hotel.badge}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center text-sm text-white/80">
                        <FiMapPin className="mr-2" />
                        {hotel.destination}, {hotel.region}
                      </p>
                      <h3 className="mt-2 text-2xl font-serif leading-tight">{hotel.name}</h3>
                    </div>
                    <div className="rounded-full bg-black/30 px-3 py-1 text-sm">
                      <FiStar className="mr-1 inline text-yellow-300" />
                      {hotel.starRating}.0
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm leading-7 text-gray-600">{hotel.shortDescription}</p>

                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={`${hotel.slug}-${amenity}`}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">From</p>
                    <p className="mt-1 text-2xl font-serif text-primary-600">${hotel.price}</p>
                  </div>
                  <Link href={`/hotels/${hotel.slug}`}>
                    <Button variant="outline">View Hotel</Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            No hotels match the current filters yet. Reset the filters or try another destination, style, or amenity.
          </div>
        )}
      </section>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelsPageContent />
    </Suspense>
  );
}
