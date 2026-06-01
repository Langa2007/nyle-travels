'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCompass, FiMapPin, FiSliders } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const highlights = [
  {
    icon: FiMapPin,
    title: 'Your Unlisted Place',
    copy: 'Tell us the coast, city, island, reserve, or hidden escape you cannot find here.',
  },
  {
    icon: FiSliders,
    title: 'Your Travel Rhythm',
    copy: 'Choose slow luxury, family ease, romantic privacy, high adventure, or a little of everything.',
  },
  {
    icon: FiCompass,
    title: 'Our Concierge Craft',
    copy: 'We turn your wish list into a polished route with stays, transfers, moments, and timing.',
  },
];

export default function CustomJourneyTeaser() {
  return (
    <section className="relative overflow-hidden bg-[#fbf7ef] py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-2xl lg:min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85"
              alt="Luxury safari vehicle crossing golden African plains"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                Bespoke Travel Desk
              </p>
              <h3 className="max-w-md font-serif text-3xl font-bold leading-tight md:text-4xl">
                When the trip in your head is better than anything on the menu.
              </h3>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-700">
              Do Not See It Listed?
            </span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-gray-950 md:text-5xl">
              Ask for the place. We will design the journey around you.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700">
              Some dream trips do not fit neatly into a package. Share where you want to go, how you want it to feel, and who is coming. Nyle will shape the route, stays, pace, and signature moments into a private proposal.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-black/5 bg-white/75 p-5 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/custom-journey">
                <Button variant="luxury" size="lg" icon={FiArrowRight} iconPosition="right">
                  Design My Private Journey
                </Button>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-gray-300 px-6 text-base font-medium text-gray-800 transition-colors hover:border-primary-500 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Speak to a Consultant
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
