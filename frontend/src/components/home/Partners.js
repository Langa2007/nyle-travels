'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fetchSettings } from '@/utils/settings';

const permanentPartners = [
  { id: 'perm-1', name: 'Kenya Airways', logo: '/brands/kenya-airways.svg' },
  { id: 'perm-2', name: 'KWS', logo: '/brands/kws.svg' },
  { id: 'perm-3', name: 'Jambojet', logo: '/brands/jambojet.svg' },
  { id: 'perm-sarova-shield', name: 'Sarova Hotels', logo: 'https://www.sarovahotels.com/assets/images/logo.png' },
  { id: 'perm-serena', name: 'Serena Hotels', logo: '/brands/serena-hotels.svg' },
  { id: 'perm-safarilink', name: 'Safarilink', logo: '/brands/safarilink.svg' },
  { id: 'perm-iata', name: 'IATA', logo: '/brands/iata-svgrepo-com.svg' },
];

export default function Partners() {
  const [activePartners, setActivePartners] = useState(permanentPartners);

  useEffect(() => {
    const loadPartners = async () => {
      const data = await fetchSettings('partners');
      if (data && Array.isArray(data) && data.length > 0) {
        // filter out duplicates by name to be safe
        const fetchedNames = new Set(permanentPartners.map(p => p.name.toLowerCase()));
        const uniqueFetched = data.filter(p => !fetchedNames.has(p.name.toLowerCase()));
        setActivePartners([...permanentPartners, ...uniqueFetched]);
      }
    };
    loadPartners();
  }, []);

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

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {activePartners.map((partner) => (
            <motion.div
              key={partner.id}
              className="group flex h-20 items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex h-16 w-40 items-center justify-center transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={220}
                  height={72}
                  className="h-10 w-auto object-contain"
                  unoptimized={partner.logo.startsWith('http')}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
