'use client';

import { useState, useEffect } from 'react';
import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiChevronRight, FiPercent } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Countdown from 'react-countdown';
import { fetchSettings } from '@/utils/settings';

const defaultOffers = [
  {
    id: 1,
    title: 'Early Bird Safari',
    description: 'Book 6 months in advance and save 20% on luxury safaris in Maasai Mara and Serengeti.',
    discount: 20,
    code: 'EARLYBIRD20',
    validUntil: '2024-12-31',
    image: 'https://picsum.photos/seed/nyle_offer1/800/600',
    type: 'Early Bird',
  },
  {
    id: 2,
    title: 'Honeymoon Paradise',
    description: 'Special romance package with private bush dinners and spa treatments at Diani Beach.',
    discount: 15,
    code: 'HONEYMOON15',
    validUntil: '2024-12-31',
    image: 'https://picsum.photos/seed/nyle_offer2/800/600',
    type: 'Romance',
  },
  {
    id: 3,
    title: 'Family Adventure',
    description: 'Kids stay and eat free on selected family tours across East Africa\'s premier parks.',
    discount: 25,
    code: 'FAMILY25',
    validUntil: '2024-12-31',
    image: 'https://picsum.photos/seed/nyle_offer3/800/600',
    type: 'Family',
  }
];

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) return <span className="text-red-500 font-bold uppercase">Expired</span>;
  return (
    <div className="flex gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{days}</div>
        <div className="text-[10px] uppercase text-gray-400">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{hours}</div>
        <div className="text-[10px] uppercase text-gray-400">Hrs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{minutes}</div>
        <div className="text-[10px] uppercase text-gray-400">Mins</div>
      </div>
    </div>
  );
};

export default function OffersPage() {
  const [offers, setOffers] = useState(defaultOffers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchSettings('offers');
        if (data && Array.isArray(data) && data.length > 0) {
          setOffers(data.map((item, index) => ({
            ...defaultOffers[index % defaultOffers.length],
            ...item
          })));
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  const content = (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 right-6">
                <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-xl font-bold">{offer.discount}%</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest">OFF</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary-600 uppercase tracking-widest">
                <FiTag /> {offer.type}
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4 font-bold">{offer.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{offer.description}</p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 uppercase tracking-widest font-bold">
                  <FiClock /> Time Remaining
                </div>
                <Countdown date={new Date(offer.validUntil)} renderer={CountdownRenderer} />
              </div>

              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100 mb-8">
                <span className="font-mono font-bold text-primary-700">{offer.code}</span>
                <span className="text-[10px] font-bold text-primary-600 uppercase">Use at checkout</span>
              </div>

              <Link href={`/tours`}>
                <Button variant="primary" className="w-full">Book Experience</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Exclusive Journeys" 
      subtitle="Exceptional value on curated luxury African experiences."
      content={content}
    />
  );
}
