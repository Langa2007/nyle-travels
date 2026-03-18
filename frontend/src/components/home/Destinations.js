'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const destinations = [
  {
    id: 1,
    name: 'Maasai Mara',
    country: 'Kenya',
    slug: 'maasai-mara',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2070',
    description: 'Witness the Great Migration and the Big Five in Africa\'s most famous reserve.',
    tours: 24,
    hotels: 18,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Diani Beach',
    country: 'Kenya',
    slug: 'diani-beach',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025',
    description: 'Pristine white sands and crystal-clear waters of the Indian Ocean.',
    tours: 15,
    hotels: 32,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Amboseli',
    country: 'Kenya',
    slug: 'amboseli',
    image: 'https://images.unsplash.com/photo-1549362157-6c7e6e3e33e4?q=80&w=2070',
    description: 'Iconic views of Mount Kilimanjaro and large elephant herds.',
    tours: 18,
    hotels: 12,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Tsavo',
    country: 'Kenya',
    slug: 'tsavo',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072',
    description: 'Kenya\'s largest national park with diverse landscapes and wildlife.',
    tours: 20,
    hotels: 15,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Lake Nakuru',
    country: 'Kenya',
    slug: 'lake-nakuru',
    image: 'https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=2070',
    description: 'Famous for flamingos and rhino sanctuary.',
    tours: 12,
    hotels: 8,
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Samburu',
    country: 'Kenya',
    slug: 'samburu',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072',
    description: 'Unique wildlife species and rich Samburu culture.',
    tours: 14,
    hotels: 10,
    rating: 4.7,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Destinations() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination, index) => (
        <motion.div
          key={destination.id}
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onMouseEnter={() => setHoveredId(destination.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Link href={`/destinations/${destination.slug}`}>
            <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
              {/* Image */}
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center text-sm mb-2">
                  <FiMapPin className="mr-1" />
                  <span>{destination.country}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                  {destination.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <span>{destination.tours} Tours</span>
                  <span>•</span>
                  <span>{destination.hotels} Hotels</span>
                  <span>•</span>
                  <span>★ {destination.rating}</span>
                </div>

                {/* Explore Button - Appears on Hover */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredId === destination.id ? 1 : 0,
                    y: hoveredId === destination.id ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-6 right-6"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <FiChevronRight className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                ★ {destination.rating}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* View All Button */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="col-span-full text-center mt-12"
      >
        <Link href="/destinations">
          <Button variant="outline" size="lg">
            Explore All Destinations
            <FiChevronRight className="ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}