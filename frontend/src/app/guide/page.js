'use client';

import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { FiCheckCircle, FiSearch, FiMousePointer, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: FiSearch,
    title: 'Explore Destinations',
    description: 'Browse our curated collection of luxury safaris and beach holidays. Get inspired by our expert-led itineraries and premium lodges.',
  },
  {
    icon: FiMousePointer,
    title: 'Inquire & Customize',
    description: 'Reach out to our specialists using any of our contact forms. We will work with you to tailor every detail of your African journey.',
  },
  {
    icon: FiCalendar,
    title: 'Confirm & Reserve',
    description: 'Once you are happy with the itinerary, we will provide you with a secure booking link to reserve your spot with a deposit.',
  },
  {
    icon: FiCreditCard,
    title: 'Finalize & Prepare',
    description: 'Settle the final balance 60 days before departure. Receive your comprehensive travel kit, including packing lists and flight details.',
  },
];

export default function GuidePage() {
  const content = (
    <div className="space-y-16">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center uppercase tracking-widest leading-tight">Your Journey Starts Here</h2>
        <p className="text-center max-w-2xl mx-auto italic text-lg text-gray-700">
          Booking a luxury safari with Nyle Travel is designed to be as seamless and enjoyable as the journey itself.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all duration-500 group text-center"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mb-6 mx-auto shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
              <item.icon size={32} />
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-4">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <section className="bg-gray-900 rounded-[50px] p-12 md:p-20 text-white text-center">
        <h3 className="text-3xl font-serif mb-6">Expert Guidance Every Step of the Way</h3>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto italic">
          Our specialized consultants are available to answer any questions and provide personalized expert advice at any stage of your booking process.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
            Start Your Inquiry Today
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Booking Guide" 
      subtitle="Insights, news, and inspiration for your next African adventure."
      content={content}
    />
  );
}
