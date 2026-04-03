'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiStar,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import {
  getFeaturedHotels,
  getHotelImage,
} from '@/lib/hotelCatalog';

export default function HotelDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const { hotels, loading } = useHotelCatalog(hotelsSeed);
  const hotel = hotels.find((item) => item.slug === slug);

  const relatedHotels = hotel
    ? hotels
        .filter((item) => item.slug !== hotel.slug && item.destination === hotel.destination)
        .slice(0, 3)
    : getFeaturedHotels(hotels, 3);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#faf8f2] pt-40">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-serif text-gray-900">{loading ? 'Loading hotel...' : 'Hotel not found'}</h1>
            <p className="mt-3 text-gray-500">
              {loading
                ? 'Fetching the shared hotels catalog.'
                : 'This hotel is no longer in the shared catalog or the link is outdated.'}
            </p>
            <Link href="/hotels" className="mt-6 inline-block">
              <Button variant="primary">Back to Hotels</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = getHotelImage(hotel);

  return (
    <div className="min-h-screen bg-[#faf8f2]">
      <section className="relative min-h-[70vh] overflow-hidden pt-32">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={hotel.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/35" />
        </div>

        <div className="relative container mx-auto px-4 pb-16 pt-24 text-white">
          <Link href="/hotels" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20">
            <FiArrowLeft className="mr-2" />
            Back to hotels
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">{hotel.badge}</p>
            <h1 className="mt-4 text-5xl font-serif leading-tight md:text-6xl">{hotel.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/85">
              <span className="inline-flex items-center">
                <FiMapPin className="mr-2" />
                {hotel.destination}, {hotel.region}
              </span>
              <span className="inline-flex items-center">
                <FiStar className="mr-2 text-yellow-300" />
                {hotel.starRating}.0 stars
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 capitalize">
                {hotel.type}
              </span>
            </div>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">{hotel.description}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Rate</p>
            <p className="mt-2 text-3xl font-serif text-primary-600">${hotel.price}</p>
            <p className="mt-2 text-sm text-gray-500">starting nightly guide</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Destination</p>
            <p className="mt-2 text-2xl font-serif text-gray-900">{hotel.destination}</p>
            <p className="mt-2 text-sm text-gray-500">Kenya travel region</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Style</p>
            <p className="mt-2 text-2xl font-serif capitalize text-gray-900">{hotel.type}</p>
            <p className="mt-2 text-sm text-gray-500">hotel collection category</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Rating</p>
            <p className="mt-2 text-2xl font-serif text-gray-900">{hotel.starRating}.0</p>
            <p className="mt-2 text-sm text-gray-500">star position in the catalog</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
              <div className="relative h-[420px] bg-gray-100">
                <Image src={heroImage} alt={hotel.name} fill className="object-cover" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-serif text-gray-900">Why travelers book this stay</h2>
              <p className="mt-4 text-base leading-8 text-gray-600">{hotel.description}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center rounded-2xl bg-[#f7f3ea] px-4 py-4 text-sm text-gray-700">
                    <FiCheckCircle className="mr-3 text-primary-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Plan This Stay</p>
              <h2 className="mt-3 text-2xl font-serif text-gray-900">Use it in your shortlist</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                This hotel card is powered by the same editable admin catalog, so image changes and content edits update here without rebuilding the layout structure.
              </p>
              <div className="mt-6 space-y-3">
                <Link href="/hotels" className="block">
                  <Button variant="primary" fullWidth>
                    Explore More Hotels
                  </Button>
                </Link>
                <Link href={`/hotels?destination=${encodeURIComponent(hotel.destination)}`} className="block">
                  <Button variant="outline" fullWidth>
                    More In {hotel.destination}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Quick Facts</p>
              <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-4">
                  <span>Destination</span>
                  <span className="font-medium text-gray-900">{hotel.destination}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Region</span>
                  <span className="font-medium text-gray-900">{hotel.region}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Style</span>
                  <span className="font-medium capitalize text-gray-900">{hotel.type}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Starting rate</span>
                  <span className="font-medium text-gray-900">${hotel.price} / night</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Nearby Inspiration</p>
            <h2 className="mt-2 text-3xl font-serif text-gray-900">More stays to compare</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedHotels.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                <div className="relative h-56 bg-gray-100">
                  <Image src={getHotelImage(item)} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{item.destination}</p>
                  <h3 className="mt-2 text-xl font-serif text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{item.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-primary-600">from ${item.price}</span>
                    <Link href={`/hotels/${item.slug}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
