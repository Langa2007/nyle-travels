'use client';

import { motion } from 'framer-motion';
import StaticPageHeader from '@/components/ui/StaticPageHeader';

export default function BasicStaticPage({ title, subtitle, content }) {
  return (
    <div className="bg-white">
      <StaticPageHeader 
        title={title} 
        subtitle={subtitle}
        bgImage={`https://picsum.photos/seed/nyle_${title.toLowerCase().replace(/\s+/g, '_')}/1920/1080`}
      />

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-primary max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:text-gray-600 prose-p:leading-relaxed"
          >
            {content}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
