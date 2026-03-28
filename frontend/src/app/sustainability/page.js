'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { FiWind, FiUsers, FiShield, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const initiatives = [
  {
    icon: FiWind,
    title: 'Carbon Neutral Safaris',
    description: 'We offset the carbon footprint of every journey through certified reforestation projects in East Africa.',
  },
  {
    icon: FiUsers,
    title: 'Community Empowerment',
    description: '10% of our profits go directly to supporting local schools and healthcare clinics in the regions we visit.',
  },
  {
    icon: FiShield,
    title: 'Wildlife Conservation',
    description: 'We partner with leading anti-poaching units to protect the majestic creatures that make Africa unique.',
  },
  {
    icon: FiHeart,
    title: 'Ethical Partnerships',
    description: 'We only work with lodges and suppliers who meet our rigorous standards for environmental and social responsibility.',
  },
];

export default function SustainabilityPage() {
  const content = (
    <div className="space-y-16">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-6 text-center">Our Commitment to the Future</h2>
        <p className="text-center max-w-2xl mx-auto">
          At Nyle Travel, we believe that luxury and conservation must go hand in hand. We are dedicated to preserving Africa's raw beauty for generations to come.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initiatives.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all duration-500 group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mb-6 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
              <item.icon size={32} />
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-4">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <section className="bg-gray-900 rounded-[50px] p-12 md:p-20 text-white text-center">
        <h3 className="text-3xl font-serif mb-6">Join Us in Making a Difference</h3>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Every journey you book with Nyle Travel contributes to these vital initiatives. Together, we can ensure that Africa remains as wild and beautiful as it is today.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-full">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Over 10,000 trees planted in 2023</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-full">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Supporting 5 local schools</span>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Sustainability" 
      subtitle="Preserving Africa's raw beauty through ethical and luxury travel."
      content={content}
    />
  );
}
