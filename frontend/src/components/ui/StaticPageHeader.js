'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function StaticPageHeader({ title, subtitle, bgImage = 'https://picsum.photos/seed/nyle_static/1920/1080' }) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-1 bg-primary-500 mx-auto mt-8 origin-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
