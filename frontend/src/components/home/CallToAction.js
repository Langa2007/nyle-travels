'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGlobe, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/sezh9d/800/600"
          alt="Explore Abroad Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-gray-900/80" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="inline-flex p-4 bg-primary-600/20 backdrop-blur-sm rounded-2xl mb-8 border border-primary-500/30">
              <FiGlobe className="w-8 h-8 text-primary-400" />
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Want to explore <span className="text-primary-400">abroad?</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Step beyond the ordinary. Let us craft a bespoke international journey tailored perfectly to your tastes, with the same signature luxury and attention to detail you expect from Nyle.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full group px-8"
                >
                  <span className="flex items-center">
                    Speak to an Advisor
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/destinations" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-white border-white/30 hover:bg-white/10"
                >
                  View Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
