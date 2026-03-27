'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { fetchSettings } from '@/utils/settings';

const iconMap = {
  FiShield, FiStar, FiUsers, FiClock, FiCompass, FiAward, FiHeart, FiGlobe
};

const defaultFeatures = [
  {
    id: 1,
    icon: 'FiShield',
    title: 'Safety First',
    description: 'Your safety is our top priority with 24/7 support and emergency protocols.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    icon: 'FiStar',
    title: 'Luxury Experiences',
    description: 'Hand-picked premium accommodations and exclusive experiences.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 3,
    icon: 'FiUsers',
    title: 'Expert Guides',
    description: 'Knowledgeable local guides with years of experience.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    icon: 'FiClock',
    title: '24/7 Concierge',
    description: 'Round-the-clock personal assistance throughout your journey.',
    color: 'from-purple-500 to-pink-500',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function WhyChooseUs() {
  const [activeFeatures, setActiveFeatures] = useState(defaultFeatures);

  useEffect(() => {
    const loadFeatures = async () => {
      const data = await fetchSettings('benefits');
      if (data && Array.isArray(data) && data.length > 0) {
        setActiveFeatures(data.map((item, index) => ({
          ...defaultFeatures[index % defaultFeatures.length],
          ...item
        })));
      }
    };
    loadFeatures();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {activeFeatures.map((feature, index) => {
        const Icon = iconMap[feature.icon] || FiStar;
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
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
              {feature.title}
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              {feature.description}
            </p>

            {/* Decorative Line */}
            <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`} />
          </motion.div>
        );
      })}
    </div>
  );
}