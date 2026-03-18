'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import FeaturedTours from '@/components/home/FeaturedTours';
import Destinations from '@/components/home/Destinations';
import LuxuryHotels from '@/components/home/LuxuryHotels';
import Testimonials from '@/components/home/Testimonials';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Newsletter from '@/components/home/Newsletter';
import InstagramFeed from '@/components/home/InstagramFeed';
import Stats from '@/components/home/Stats';
import VideoShowcase from '@/components/home/VideoShowcase';
import ExclusiveOffers from '@/components/home/ExclusiveOffers';
import TravelBlog from '@/components/home/TravelBlog';
import Partners from '@/components/home/Partners';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Stats Section */}
      <section className="relative -mt-20 z-10">
        <div className="container mx-auto px-4">
          <Stats />
        </div>
      </section>

      {/* Why Choose Us */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
              Why Choose Nyle
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              Experience <span className="text-primary-600">Luxury</span> Redefined
            </h2>
            <p className="text-gray-600 text-lg">
              We curate extraordinary experiences that combine luxury, authenticity, and sustainability.
            </p>
          </motion.div>
          <WhyChooseUs />
        </div>
      </motion.section>

      {/* Featured Tours */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
              Curated Experiences
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              Featured <span className="text-primary-600">Safaris</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our most exclusive safari experiences, meticulously crafted for discerning travelers.
            </p>
          </motion.div>
          <FeaturedTours />
        </div>
      </motion.section>

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Destinations */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-24 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
              Explore
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              Breathtaking <span className="text-primary-600">Destinations</span>
            </h2>
            <p className="text-gray-600 text-lg">
              From the savannahs of Maasai Mara to the pristine beaches of Diani.
            </p>
          </motion.div>
          <Destinations />
        </div>
      </motion.section>

      {/* Luxury Hotels */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
              Accommodations
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              <span className="text-primary-600">Luxury</span> Stays
            </h2>
            <p className="text-gray-600 text-lg">
              Hand-picked luxury lodges and camps that redefine comfort in the wild.
            </p>
          </motion.div>
          <LuxuryHotels />
        </div>
      </motion.section>

      {/* Exclusive Offers */}
      <ExclusiveOffers />

      {/* Testimonials */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-24 bg-gray-900 text-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">
              Guest Experiences
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              What Our <span className="text-primary-400">Guests Say</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Real stories from travelers who experienced the Nyle difference.
            </p>
          </motion.div>
          <Testimonials />
        </div>
      </motion.section>

      {/* Travel Blog */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
              Journal
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">
              From Our <span className="text-primary-600">Blog</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Stories, guides, and insights from the world of luxury travel.
            </p>
          </div>
          <TravelBlog />
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Partners */}
      <Partners />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}