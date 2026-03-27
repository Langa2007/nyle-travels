'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiPercent, FiGift, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Countdown from 'react-countdown';

const defaultOffers = [
  {
    id: 1,
    title: 'Early Bird Safari',
    description: 'Book 6 months in advance and save big on luxury safaris',
    discount: 20,
    code: 'EARLYBIRD20',
    validUntil: new Date('2024-06-30'),
    image: 'https://picsum.photos/seed/dnanf/800/600',
    type: 'Early Bird',
  },
  {
    id: 2,
    title: 'Honeymoon Paradise',
    description: 'Special romance package with spa treatments and champagne',
    discount: 15,
    code: 'HONEYMOON15',
    validUntil: new Date('2024-12-31'),
    image: 'https://picsum.photos/seed/qii2pf/800/600',
    type: 'Romance',
  },
  {
    id: 3,
    title: 'Family Adventure',
    description: 'Kids stay and eat free on selected family tours',
    discount: 25,
    code: 'FAMILY25',
    validUntil: new Date('2024-08-31'),
    image: 'https://picsum.photos/seed/o4lgl9/800/600',
    type: 'Family',
  },
];

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span className="text-red-500">Expired</span>;
  } else {
    return (
      <div className="flex space-x-2 text-sm">
        <div className="text-center">
          <span className="text-2xl font-bold text-primary-600">{days}</span>
          <span className="text-gray-500 text-xs block">Days</span>
        </div>
        <span className="text-2xl font-bold text-primary-600">:</span>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary-600">{hours}</span>
          <span className="text-gray-500 text-xs block">Hours</span>
        </div>
        <span className="text-2xl font-bold text-primary-600">:</span>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary-600">{minutes}</span>
          <span className="text-gray-500 text-xs block">Mins</span>
        </div>
      </div>
    );
  }
};

export default function ExclusiveOffers() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeOffers, setActiveOffers] = useState(defaultOffers);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
        if (!apiUrl) return;
        
        const res = await fetch(`${apiUrl}/settings/exclusive_offers_sections`);
        const result = await res.json();
        
        if (result.status === 'success' && result.data && Array.isArray(result.data) && result.data.length > 0) {
          setActiveOffers(result.data.map((item, index) => ({
            ...defaultOffers[index % defaultOffers.length],
            ...item,
            id: item.id || defaultOffers[index % defaultOffers.length].id,
            image: item.image || defaultOffers[index % defaultOffers.length].image,
            validUntil: item.validUntil ? new Date(item.validUntil) : defaultOffers[index % defaultOffers.length].validUntil,
            type: item.type || defaultOffers[index % defaultOffers.length].type
          })));
        }
      } catch (error) {
        console.error('Failed to fetch offers settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex p-3 bg-primary-100 rounded-2xl mb-4">
            <FiPercent className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Exclusive <span className="text-primary-600">Offers</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Limited-time deals on luxury experiences. Book now to secure your savings.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-2xl font-bold">
                      {offer.discount}% OFF
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                      {offer.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                  {/* Countdown Timer */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FiClock className="mr-2" />
                      <span>Offer ends in:</span>
                    </div>
                    <Countdown
                      date={offer.validUntil}
                      renderer={CountdownRenderer}
                    />
                  </div>

                  {/* Promo Code */}
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl mb-4">
                    <span className="font-mono font-bold text-primary-700">{offer.code}</span>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {copiedCode === offer.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  {/* CTA */}
                  <Link href={`/offers/${offer.id}`}>
                    <Button variant="outline" fullWidth>
                      View Offer
                      <FiChevronRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/offers">
            <Button variant="outline" size="lg">
              View All Offers
              <FiChevronRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
