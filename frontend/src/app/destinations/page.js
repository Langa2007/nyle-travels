'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import { fetchAllSettings } from '@/utils/settings';
import { destinationsAPI } from '@/lib/api';
import { destinations as seedDestinations } from '@/app/destination';
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import BookingIntentModal from '@/components/booking/BookingIntentModal';

const SETTINGS_KEY = 'destinations_catalog';

function parseList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

function destinationKey(destination) {
  return firstString(destination?.slug, destination?.name).toLowerCase();
}

function readApiDestinations(response) {
  const rawData = response?.data;

  if (Array.isArray(rawData?.data?.destinations)) {
    return rawData.data.destinations;
  }

  if (Array.isArray(rawData?.destinations)) {
    return rawData.destinations;
  }

  if (Array.isArray(rawData)) {
    return rawData;
  }

  return [];
}

function normalizeDestination(destination, index = 0) {
  const image = firstString(
    destination.image,
    destination.featured_image,
    destination.featuredImage,
    destination.coverImage,
    destination.defaultImage,
    destination.default_image
  );
  const gallery = parseList(destination.gallery ?? destination.gallery_images);
  const imageFallbacks = uniqueList([
    ...parseList(destination.imageFallbacks),
    ...gallery,
    firstString(destination.featured_image, destination.featuredImage),
    firstString(destination.defaultImage, destination.default_image),
  ]).filter((fallback) => fallback !== image);

  return {
    ...destination,
    id: destination.id ?? `destination-${index + 1}`,
    name: destination.name ?? '',
    slug: destination.slug ?? '',
    region: destination.region ?? '',
    country: destination.country ?? 'Kenya',
    description: destination.description ?? '',
    shortDescription: destination.shortDescription ?? destination.short_description ?? '',
    bestTimeToVisit: destination.bestTimeToVisit ?? destination.best_time_to_visit ?? '',
    weather: destination.weather ?? '',
    activities: parseList(destination.activities),
    wildlife: parseList(destination.wildlife),
    image,
    imageFallbacks,
    gallery,
    rating: Number(destination.rating ?? 0),
    featured: Boolean(destination.featured ?? destination.is_featured),
    tourCount: Number(destination.tourCount ?? destination.tour_count ?? 0),
    hotelCount: Number(destination.hotelCount ?? destination.hotel_count ?? 0),
    area: destination.area ? String(destination.area) : '',
    established: destination.established ? String(destination.established) : '',
  };
}

function mergeDestinationCatalog(catalog, apiDestinations) {
  const apiBySlug = new Map(apiDestinations.map((destination) => [destinationKey(destination), destination]));
  const sourceCatalog = Array.isArray(catalog) && catalog.length > 0 ? catalog : apiDestinations;

  return sourceCatalog.map((destination, index) => {
    const apiDestination = apiBySlug.get(destinationKey(destination));
    const apiImage = firstString(apiDestination?.featured_image, apiDestination?.image, apiDestination?.featuredImage);
    const catalogImage = firstString(destination.image, destination.featured_image, destination.featuredImage);

    return normalizeDestination(
      {
        ...(apiDestination || {}),
        ...destination,
        image: apiImage || catalogImage,
        imageFallbacks: uniqueList([
          apiImage,
          catalogImage,
          ...parseList(apiDestination?.gallery_images),
          ...parseList(destination.gallery),
          ...parseList(destination.gallery_images),
        ]),
      },
      index
    );
  });
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState(
    seedDestinations.map((destination, index) => normalizeDestination(destination, index))
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [bookingDestination, setBookingDestination] = useState(null);
  const [imageOverrides, setImageOverrides] = useState({});

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        const [settingsResult, apiResult] = await Promise.allSettled([
          fetchAllSettings(),
          destinationsAPI.getAll({ limit: 200 }),
        ]);
        const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
        const apiDestinations = apiResult.status === 'fulfilled' ? readApiDestinations(apiResult.value) : [];
        const savedCatalog = settings?.[SETTINGS_KEY];

        if (mounted && ((Array.isArray(savedCatalog) && savedCatalog.length > 0) || apiDestinations.length > 0)) {
          setDestinations(mergeDestinationCatalog(savedCatalog, apiDestinations));
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

  function getDestinationImage(destination) {
    return Object.prototype.hasOwnProperty.call(imageOverrides, destination.id)
      ? imageOverrides[destination.id]
      : destination.image;
  }

  function handleImageError(destination) {
    const currentImage = getDestinationImage(destination);
    const nextImage = destination.imageFallbacks.find((image) => image && image !== currentImage) || '';

    setImageOverrides((current) => ({
      ...current,
      [destination.id]: nextImage,
    }));
  }

  return (
    <div className="min-h-screen bg-[#faf8f2]">
      <BookingIntentModal
        open={Boolean(bookingDestination)}
        onClose={() => setBookingDestination(null)}
        item={bookingDestination}
        itemType="destination"
      />
      <StaticPageHeader
        title="Destinations"
        subtitle="Explore the full destination catalog curated just for you to explore magical Kenya ."
        bgImage={headerImage}
      />

      <section className="container mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Catalog</p>
            <p className="text-3xl font-serif text-gray-900 mt-2">{destinations.length}</p>
            <p className="text-sm text-gray-500 mt-2">destinations to behold.</p>
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
          {filteredDestinations.map((destination) => {
            const imageSrc = getDestinationImage(destination);

            return (
            <article
              key={destination.id}
              id={destination.slug}
              className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-72 bg-gray-100">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(destination)}
                  />
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

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Group friendly</p>
                    <p className="mt-1 text-sm text-gray-600">Build a solo or group payment plan for this destination.</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setBookingDestination({
                      ...destination,
                      image: imageSrc,
                      estimated_price: 15000,
                    })}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </article>
            );
          })}
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
