'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import { fetchAllSettings } from '@/utils/settings';
import { destinations as seedDestinations } from '@/app/destination';
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi';

const SETTINGS_KEY = 'destinations_catalog';

function parseList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDestination(destination, index = 0) {
  return {
    ...destination,
    id: destination.id ?? `destination-${index + 1}`,
    name: destination.name ?? '',
    slug: destination.slug ?? '',
    region: destination.region ?? '',
    country: destination.country ?? 'Kenya',
    description: destination.description ?? '',
    shortDescription: destination.shortDescription ?? '',
    bestTimeToVisit: destination.bestTimeToVisit ?? '',
    weather: destination.weather ?? '',
    activities: parseList(destination.activities),
    wildlife: parseList(destination.wildlife),
    image: destination.image ?? '',
    gallery: parseList(destination.gallery),
    rating: Number(destination.rating ?? 0),
    featured: Boolean(destination.featured),
    tourCount: Number(destination.tourCount ?? 0),
    hotelCount: Number(destination.hotelCount ?? 0),
    area: destination.area ? String(destination.area) : '',
    established: destination.established ? String(destination.established) : '',
  };
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState(
    seedDestinations.map((destination, index) => normalizeDestination(destination, index))
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        const settings = await fetchAllSettings();
        const savedCatalog = settings?.[SETTINGS_KEY];

        if (mounted && Array.isArray(savedCatalog) && savedCatalog.length > 0) {
          setDestinations(savedCatalog.map((destination, index) => normalizeDestination(destination, index)));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      mounted = false;
    };
  }, []);

  const regions = ['all', ...new Set(destinations.map((destination) => destination.region).filter(Boolean))];
  const filteredDestinations = destinations.filter((destination) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      destination.name.toLowerCase().includes(query) ||
      destination.region.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query);
    const matchesRegion = regionFilter === 'all' || destination.region === regionFilter;
    const matchesFeatured = !featuredOnly || destination.featured;

    return matchesSearch && matchesRegion && matchesFeatured;
  });

  const featuredCount = destinations.filter((destination) => destination.featured).length;
  const headerImage =
    destinations.find((destination) => destination.image)?.image ||
    'https://picsum.photos/seed/nyle_destinations/1920/1080';

  return (
    <div className="min-h-screen bg-[#faf8f2]">
      <StaticPageHeader
        title="Destinations"
        subtitle="Explore the full destination catalog and jump straight from the navbar into the places that matter most."
        bgImage={headerImage}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Catalog</p>
            <p className="text-3xl font-serif text-gray-900 mt-2">{destinations.length}</p>
            <p className="text-sm text-gray-500 mt-2">destinations to behold</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Featured</p>
            <p className="text-3xl font-serif text-primary-600 mt-2">{featuredCount}</p>
            <p className="text-sm text-gray-500 mt-2">highlighted destinations</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Status</p>
            <p className="text-3xl font-serif text-gray-900 mt-2">{loading ? 'Explore' : 'Ready'}</p>
            <p className="text-sm text-gray-500 mt-2">Great Destinations Await</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by destination, region, country, or experience..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setFeaturedOnly((current) => !current)}
              className={`px-5 py-4 rounded-2xl font-medium transition-colors ${
                featuredOnly ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Featured Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDestinations.map((destination) => (
            <article
              key={destination.id}
              id={destination.slug}
              className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-72 bg-gray-100">
                {destination.image ? (
                  <Image src={destination.image} alt={destination.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-5 left-5 flex gap-2">
                  {destination.featured && (
                    <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </span>
                  )}
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900">
                    {destination.country}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center text-sm text-white/85 mb-2">
                    <FiMapPin className="mr-2" />
                    {destination.region}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-serif">{destination.name}</h2>
                      <p className="mt-2 text-white/85">{destination.shortDescription}</p>
                    </div>
                    <div className="flex items-center rounded-full bg-black/30 px-3 py-1 text-sm">
                      <FiStar className="mr-1 text-yellow-300" />
                      {destination.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-gray-600 leading-7">{destination.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-[#f7f3ea] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Tours</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{destination.tourCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f3ea] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Hotels</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{destination.hotelCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f3ea] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Best Time</p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {destination.bestTimeToVisit || 'Year-round'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f3ea] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Weather</p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {destination.weather || 'Varies'}
                    </p>
                  </div>
                </div>

                {destination.activities.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {destination.activities.map((activity) => (
                        <span
                          key={activity}
                          className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {destination.wildlife.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Wildlife</h3>
                    <div className="flex flex-wrap gap-2">
                      {destination.wildlife.map((animal) => (
                        <span key={animal} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                          {animal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {destination.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {destination.gallery.slice(0, 3).map((image) => (
                      <div key={image} className="relative h-32 overflow-hidden rounded-2xl bg-gray-100">
                        <Image src={image} alt={destination.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            No destinations match your search yet.
          </div>
        )}
      </section>
    </div>
  );
}
