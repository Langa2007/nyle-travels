'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { fetchSettings } from '@/utils/settings';

const permanentPartners = [
  { id: 'perm-1', name: 'Kenya Airways', logo: '/brands/kenya-airways.svg' },
  { id: 'perm-2', name: 'KWS', logo: '/brands/kws.svg' },
  { id: 'perm-3', name: 'Jambojet', logo: '/brands/jambojet.svg' },
  { id: 'perm-4', name: 'Sarova', logo: '/brands/sarova.svg' },
];

export default function Partners() {
  const [activePartners, setActivePartners] = useState(permanentPartners);

  useEffect(() => {
    const loadPartners = async () => {
      const data = await fetchSettings('partners');
      if (data && Array.isArray(data) && data.length > 0) {
        // combine permanent partners and any newly added ones, avoiding duplicates if any have the same names (just visual fallback)
        const combined = [...permanentPartners, ...data];
        setActivePartners(combined);
      }
    };
    loadPartners();
  }, []);

  // To fix Swiper loop warning where we don't have enough slides, 
  // duplicate the array if there are fewer than 8 slides
  const displayPartners = activePartners.length < 8 
    ? [...activePartners, ...activePartners.map(p => ({...p, id: p.id + '-dup'}))] 
    : activePartners;

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
          {displayPartners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <motion.div
                className="flex h-20 items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
              >
                <div className="flex h-16 w-full items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={220}
                    height={72}
                    sizes="220px"
                    className="h-14 w-auto object-contain"
                    unoptimized={partner.logo.startsWith('http')}
                  />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
