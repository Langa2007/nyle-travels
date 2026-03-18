'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiShield, 
  FiStar, 
  FiUsers, 
  FiClock,
  FiCompass,
  FiAward,
  FiHeart,
  FiGlobe
} from 'react-icons/fi';

const features = [
  {
    id: 1,
    icon: FiShield,
    title: 'Safety First',
    description: 'Your safety is our top priority with 24/7 support and emergency protocols.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    icon: FiStar,
    title: 'Luxury Experiences',
    description: 'Hand-picked premium accommodations and exclusive experiences.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 3,
    icon: FiUsers,
    title: 'Expert Guides',
    description: 'Knowledgeable local guides with years of experience.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    icon: FiClock,
    title: '24/7 Concierge',
    description: 'Round-the-clock personal assistance throughout your journey.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 5,
    icon: FiCompass,
    title: 'Custom Itineraries',
    description: 'Tailor-made experiences designed just for you.',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 6,
    icon: FiAward,
    title: 'Award Winning',
    description: 'Recognized for excellence in luxury travel services.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 7,
    icon: FiHeart,
    title: 'Sustainable Travel',
    description: 'Eco-friendly practices supporting local communities.',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 8,
    icon: FiGlobe,
    title: 'Global Network',
    description: 'Partnerships with the world\'s finest hospitality brands.',
    color: 'from-violet-500 to-purple-500',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function WhyChooseUs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.id}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />

            {/* Icon */}
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>

            {/* Decorative Line */}
            <div className={`absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </motion.div>
        );
      })}
    </div>
  );
}