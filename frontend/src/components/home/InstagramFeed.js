'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiInstagram, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const instagramPosts = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/efr52f/800/600',
    likes: 1234,
    comments: 56,
    caption: 'Sunset views in Maasai Mara 🦁🌅',
    url: 'https://instagram.com/p/example1',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/syv2td/800/600',
    likes: 2345,
    comments: 89,
    caption: 'Luxury tented camp under the stars ✨',
    url: 'https://instagram.com/p/example2',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/xvue2/800/600',
    likes: 3456,
    comments: 123,
    caption: 'Pristine beaches of Diani 🏖️',
    url: 'https://instagram.com/p/example3',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/30nl4f/800/600',
    likes: 4567,
    comments: 234,
    caption: 'Summit day on Kilimanjaro 🏔️',
    url: 'https://instagram.com/p/example4',
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/5pjwia/800/600',
    likes: 5678,
    comments: 345,
    caption: 'Elephant family in Amboseli 🐘',
    url: 'https://instagram.com/p/example5',
  },
  {
    id: 6,
    image: 'https://picsum.photos/seed/22q29q/800/600',
    likes: 6789,
    comments: 456,
    caption: 'Rare leopard sighting in Samburu 🐆',
    url: 'https://instagram.com/p/example6',
  },
];

export default function InstagramFeed() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-2 text-primary-600 mb-4">
            <FiInstagram className="w-6 h-6" />
            <span className="font-semibold tracking-wider uppercase text-sm">
              @nyle_travel
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Follow Us on <span className="text-primary-600">Instagram</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Get inspired by our daily adventures and tag us in your photos for a chance to be featured.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={post.url} target="_blank" rel="noopener noreferrer">
                <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === post.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  >
                    {/* Stats */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                          <FiHeart className="mr-1" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <FiMessageCircle className="mr-1" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Icon */}
                    <div className="absolute top-4 right-4">
                      <FiInstagram className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="https://instagram.com/nyle_travel" target="_blank">
            <Button variant="outline" size="lg">
              Follow @nyle_travel
              <FiChevronRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}