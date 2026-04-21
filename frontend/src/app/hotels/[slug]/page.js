'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiMapPin,
  FiStar,
  FiCheck,
  FiClock,
  FiInfo,
  FiChevronLeft,
  FiShare2,
  FiHeart
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import { getHotelImage } from '@/lib/hotelCatalog';

export default function HotelDetailPage({ params }) {
  const router = useRouter();
  const { hotels, loading } = useHotelCatalog(hotelsSeed);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    if (!loading && hotels) {
      const found = hotels.find((h) => h.slug === params.slug);
      if (found) {
        setHotel(found);
      } else {
        router.replace('/hotels');
      }
    }
  }, [loading, hotels, params.slug, router]);

  if (loading || !hotel) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const images = hotel.gallery?.length > 0 ? hotel.gallery : [getHotelImage(hotel)];

  return (
    <div className="min-h-screen bg-[#faf8f2] pb-24">
      {/* Top Nav Bar */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/hotels" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
            <FiChevronLeft className="w-5 h-5 mr-1" />
            Back to Hotels
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-50 flex items-center text-gray-700 transition-colors">
              <FiShare2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center text-gray-700 transition-colors">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 mt-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 uppercase tracking-wider">
               {hotel.type}
             </span>
             {hotel.badge && (
               <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 uppercase tracking-wider">
                 {hotel.badge}
               </span>
             )}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FiMapPin className="w-4 h-4 mr-1 text-primary-600" />
              {hotel.destination}, {hotel.region}
            </div>
            <div className="flex items-center font-medium text-gray-900 border px-2 py-1 rounded-full border-gray-200">
              <FiStar className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              {hotel.starRating}.0 Rating
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12">
          {images.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden">
              <div className="md:col-span-2 row-span-2 relative h-full w-full group cursor-pointer">
                <Image src={images[0]} alt="Hero" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="relative h-full w-full group cursor-pointer">
                <Image src={images[1]} alt="Gallery 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="relative h-full w-full group cursor-pointer">
                <Image src={images[2]} alt="Gallery 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              {images.length > 3 ? (
                <div className="relative h-full w-full group cursor-pointer">
                  <Image src={images[3]} alt="Gallery 4" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ) : (
                <div className="bg-primary-50 flex items-center justify-center p-6 text-center h-full w-full">
                  <p className="text-primary-800 font-medium font-serif leading-relaxed">Relax and immerse yourself in luxury.</p>
                </div>
              )}
               {images.length > 4 ? (
                <div className="relative h-full w-full group cursor-pointer">
                  <Image src={images[4]} alt="Gallery 5" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">+{images.length - 5} More</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#132026] flex items-center justify-center p-6 text-center h-full w-full">
                  <FiStar className="text-white/20 w-16 h-16" />
                </div>
              )}
            </div>
          ) : (
             <div className="relative h-[60vh] rounded-[2rem] overflow-hidden group">
               <Image src={images[0]} alt={hotel.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
             </div>
          )}
        </div>

        {/* Content & Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-4">About this stay</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{hotel.description}</p>
            </section>

            <div className="border-t border-gray-200" />

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <FiCheck className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-gray-200" />

            <section>
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Things to know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                    <FiClock className="w-5 h-5 mr-2 text-gray-400" />
                    Check-in & Check-out
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span>Check-in time</span>
                      <span className="font-medium text-gray-900">{hotel.checkInTime || '14:00'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span>Check-out time</span>
                      <span className="font-medium text-gray-900">{hotel.checkOutTime || '11:00'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                    <FiInfo className="w-5 h-5 mr-2 text-gray-400" />
                    House Rules
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm list-disc list-inside">
                    {hotel.houseRules?.length > 0 ? hotel.houseRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    )) : (
                      <li>No specific house rules available.</li>
                    )}
                  </ul>
                </div>

              </div>
              
              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{hotel.cancellationPolicy || 'Standard cancellation policy applies.'}</p>
              </div>
            </section>
            
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-[2rem] border border-gray-200 shadow-xl shadow-gray-200/40">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">From</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-semibold text-gray-900">${hotel.price}</span>
                    <span className="text-gray-500">/night</span>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium">
                   <FiStar className="text-yellow-400 mr-1 fill-current" />
                   {hotel.starRating}.0
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                 Secure your stay at one of Kenya's finest destinations.
              </p>

              {/* Placeholder for the Booking Flow */}
              <div className="space-y-4">
                 <Button 
                    variant="primary" 
                    className="w-full justify-center py-4 text-base shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-shadow"
                    onClick={() => alert(`Booking flow placeholder for ${hotel.name}`)}
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
                No hidden fees. Instant confirmation.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
