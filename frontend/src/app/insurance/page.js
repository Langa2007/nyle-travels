'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { FiShield, FiHeart, FiLock, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

const coverages = [
  {
    icon: FiShield,
    title: 'Medical Expenses',
    description: 'Comprehensive coverage for medical emergencies and specialized care across Africa.',
  },
  {
    icon: FiHeart,
    title: 'Repatriation Cover',
    description: 'Emergency repatriation to your home country in case of a medical emergency.',
  },
  {
    icon: FiLock,
    title: 'Cancellation Cover',
    description: 'Protect your investment in case of unforeseen trip cancellations or interruptions.',
  },
  {
    icon: FiBriefcase,
    title: 'Baggage & Personal Effects',
    description: 'Security for your high-end camera equipment and luxury luggage during transit.',
  },
];

export default function InsurancePage() {
  const content = (
    <div className="space-y-16">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center uppercase tracking-widest leading-tight">Peace of Mind for Your Luxury Safari</h2>
        <p className="text-center max-w-2xl mx-auto italic text-lg text-gray-700">
          Nyle Travel strongly recommends comprehensive travel insurance for every African adventure.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coverages.map((item, index) => (
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

      <section className="bg-primary-50 p-12 md:p-20 rounded-[50px] text-center">
        <h3 className="text-3xl font-serif mb-6 text-gray-900">Partner with our Luxury Experts</h3>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          We have partnered with specialized luxury travel insurers who understand the unique requirements of high-end African safaris. Our travel consultants can provide personalized expert advice and quotes.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
            Request an Insurance Quote
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Travel Insurance" 
      subtitle="Insights, news, and inspiration for your next African adventure."
      content={content}
    />
  );
}
