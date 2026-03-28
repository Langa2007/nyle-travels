'use client';

import { useState } from 'react';
import BasicStaticPage from '@/components/ui/BasicStaticPage';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'When is the best time for a luxury safari?',
    answer: 'The best time for a safari depends on what you want to experience. For the Great Migration in the Maasai Mara, July to October is ideal. The dry season (June to October) overall offers the best wildlife viewing as animals congregate around water sources. Our luxury travel consultants can provide personalized advice based on your interests.',
  },
  {
    question: 'What is included in a luxury safari package?',
    answer: 'A luxury Nyle safari typically includes private airport transfers, premium lodge accommodations, all meals, domestic flights within Africa, specialized private guides, game drives in custom 4x4 vehicles, and park fees. We can also include additional experiences like hot air balloon rides, cultural visits, and private champagne sundowners.',
  },
  {
    question: 'Are safaris safe for families?',
    answer: 'Absolutely! Many of our partner luxury lodges are family-friendly and offer specialized junior ranger programs and child-friendly activities. We curate itineraries that balance adventure with safety and the unique needs of your family.',
  },
  {
    question: 'What should I pack for a safari?',
    answer: 'We recommend comfortable, neutral-colored clothing, layered for varying temperatures. Essential items include a wide-brimmed hat, high-quality binoculars, a good camera with a telephoto lens, and personal medication. Our booking guide provides a comprehensive packing list tailored to your specific destination.',
  },
  {
    question: 'Do I need vaccinations for Africa?',
    answer: 'Vaccination requirements vary depending on the destination and your recent travel history. Common recommendations include Yellow Fever, Typhoid, Hepatitis A & B, and Malaria prophylaxis. We strongly advise consulting with a travel medical clinic at least 6 weeks before your departure.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const content = (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center uppercase tracking-widest">Common Inquiries</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <h4 className="text-xl font-serif text-gray-900 group-hover:text-primary-600 transition-colors">
                  {faq.question}
                </h4>
                <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-primary-500 group-hover:text-primary-500 transition-all ${openIndex === index ? 'rotate-180 bg-primary-500 border-primary-500 text-white' : ''}`}>
                  <FiChevronDown />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-gray-600 leading-relaxed text-lg italic">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50 p-12 rounded-[50px] text-center mt-16">
        <h3 className="text-2xl font-serif mb-4">Still have questions?</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Our luxury travel consultants are available 24/7 to provide expert advice and assistance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-all">
            Contact Us Now
          </button>
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all">
            Chat with an Expert
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <BasicStaticPage 
      title="Common Inquiries" 
      subtitle="Insights, news, and inspiration for your next African adventure."
      content={content}
    />
  );
}
