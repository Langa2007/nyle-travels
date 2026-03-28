'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import { FiAward, FiGlobe, FiTarget, FiUsers, FiHeart, FiCheckCircle } from 'react-icons/fi';

const stats = [
  { label: 'Years of Experience', value: '14+' },
  { label: 'Happy Travelers', value: '50K+' },
  { label: 'Destinations', value: '12' },
  { label: 'Expert Guides', value: '200+' },
];

const values = [
  {
    icon: FiHeart,
    title: 'Passion for Africa',
    description: 'We live and breathe the African wilderness, sharing its raw beauty with the world.',
  },
  {
    icon: FiTarget,
    title: 'Excellence in Service',
    description: 'Every detail of your journey is curated to the highest standards of luxury.',
  },
  {
    icon: FiGlobe,
    title: 'Sustainable Tourism',
    description: 'We are committed to preserving the wildlife and empowering local communities.',
  },
  {
    icon: FiAward,
    title: 'Award Winning',
    description: 'Recognized globally for our commitment to luxury travel and safari excellence.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <StaticPageHeader 
        title="Our Story" 
        subtitle="Crafting extraordinary African journeys since 2010."
        bgImage="https://picsum.photos/seed/nyle_about/1920/1080"
      />

      {/* Heritage Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 bg-primary-50 rounded-full text-primary-600 text-sm font-semibold tracking-wide uppercase">
                A Decade of Excellence
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                Where Luxury Meets the <span className="text-primary-600">Untamed Wild</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2010 by a group of passionate naturalists and travel experts, Nyle Travel was born from a simple yet powerful vision: to provide discerning travelers with an unparalleled connection to Africa's majestic landscapes while ensuring the highest level of luxury and sophistication.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                What started as a small specialist agency in Nairobi has grown into a premier luxury travel house, renowned for our deep local knowledge and our commitment to creating life-changing experiences that transcend the ordinary.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-3xl font-serif text-primary-600">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl"
            >
              <Image
                src="https://picsum.photos/seed/nyle_heritage/800/800"
                alt="Nyle Heritage"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900">Our Core Values</h2>
            <p className="text-gray-600 text-lg">
              These principles guide every itinerary we craft and every partnership we form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-[50px] relative overflow-hidden px-8 py-20 md:p-20 text-center md:text-left">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 hidden lg:block">
              <Image
                src="https://picsum.photos/seed/safari_pattern/400/800"
                alt="Pattern"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            <div className="relative z-10 lg:max-w-xl">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                Our Commitment to <span className="text-primary-400">Africa</span>
              </h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                At Nyle Travel, we believe that luxury and conservation must go hand in hand. Every booking contributes to community development projects and wildlife preservation initiatives across East Africa.
              </p>

              <ul className="space-y-4 mb-10 text-white/90">
                <li className="flex items-center">
                  <FiCheckCircle className="text-primary-400 mr-3 flex-shrink-0" />
                  <span>Carbon-neutral safari operations</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-primary-400 mr-3 flex-shrink-0" />
                  <span>Support for local Maasai and Samburu schools</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-primary-400 mr-3 flex-shrink-0" />
                  <span>Anti-poaching unit sponsorships</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-primary-500/20">
                  Learn More About Sustainability
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
