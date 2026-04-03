'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiMapPin,
  FiHeart,
  FiChevronRight,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import hotelsSeed from '@/data/hotels';
import useHotelCatalog from '@/hooks/useHotelCatalog';
import {
  getFeaturedHotels,
  getHotelImage,
} from '@/lib/hotelCatalog';

export default function LuxuryHotels() {
  const [wishlist, setWishlist] = useState([]);
  const { hotels } = useHotelCatalog(hotelsSeed);
  const featuredHotels = getFeaturedHotels(hotels, 4);

  const toggleWishlist = (hotelId) => {
    setWishlist((current) =>
      current.includes(hotelId)
        ? current.filter((id) => id !== hotelId)
        : [...current, hotelId]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredHotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={getHotelImage(hotel)}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold rounded-full">
                  {hotel.badge}
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(hotel.id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <FiHeart
                  className={`w-5 h-5 transition-colors ${
                    wishlist.includes(hotel.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600'
                  }`}
                />
              </button>

              <div className="absolute bottom-4 left-4 flex items-center bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-white text-sm font-semibold">{hotel.starRating}.0</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600 transition-colors">
                    <Link href={`/hotels/${hotel.slug}`}>{hotel.name}</Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.destination}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hotel.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.map((amenity) => (
                  <span
                    key={`${hotel.slug}-${amenity}`}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">From</span>
                  <span className="text-2xl font-bold text-primary-600 ml-1">${hotel.price}</span>
                  <span className="text-sm text-gray-500">/night</span>
                </div>
                <Link href={`/hotels/${hotel.slug}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="col-span-full text-center mt-12"
      >
        <Link href="/hotels">
          <Button variant="outline" size="lg">
            Explore All Hotels
            <FiChevronRight className="ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
