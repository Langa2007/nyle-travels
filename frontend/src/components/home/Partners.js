'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const partners = [
  {
    id: 1,
    name: 'Emirates',
    logo: 'https://picsum.photos/seed/logo_nsmbz9/200/200',
    url: '#',
  },
  {
    id: 2,
    name: 'Kenya Airways',
    logo: 'https://picsum.photos/seed/logo_16okag/200/200',
    url: '#',
  },
  {
    id: 3,
    name: 'Marriott',
    logo: 'https://picsum.photos/seed/logo_7qyf0y/200/200',
    url: '#',
  },
  {
    id: 4,
    name: 'Hilton',
    logo: 'https://picsum.photos/seed/logo_nni8mh/200/200',
    url: '#',
  },
  {
    id: 5,
    name: 'Four Seasons',
    logo: 'https://picsum.photos/seed/logo_etfh8i/200/200',
    url: '#',
  },
  {
    id: 6,
    name: 'American Express',
    logo: 'https://picsum.photos/seed/logo_q3pj4n/200/200',
    url: '#',
  },
  {
    id: 7,
    name: 'Visa',
    logo: 'https://picsum.photos/seed/logo_h37ljt/200/200',
    url: '#',
  },
  {
    id: 8,
    name: 'Mastercard',
    logo: 'https://picsum.photos/seed/logo_pgo8g4/200/200',
    url: '#',
  },
];

export default function Partners() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
            Trusted by Leading Brands
          </h3>
        </motion.div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          className="partners-slider"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <motion.a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}