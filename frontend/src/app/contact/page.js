'use client';

import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiMessageSquare } from 'react-icons/fi';
import StaticPageHeader from '@/components/ui/StaticPageHeader';
import ContactForm from '@/components/contact/ContactForm';

const contactInfo = [
  {
    icon: FiMapPin,
    title: 'Visit Our Office',
    details: ['Peponi Road, Nairobi, Kenya', 'Level 4, Riverside Plaza'],
    link: 'https://maps.google.com',
  },
  {
    icon: FiPhone,
    title: 'Talk to Us',
    details: ['+254 704 521 408', '+254 113491403'],
    link: 'tel:+254704521408',
  },
  {
    icon: FiMail,
    title: 'Email Us',
    details: ['info@nyletravel.com', 'concierge@nyletravel.com'],
    link: 'mailto:info@nyletravel.com',
  },
  {
    icon: FiClock,
    title: 'Office Hours',
    details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <StaticPageHeader 
        title="Contact Us" 
        subtitle="Our luxury travel consultants are ready to craft your dream African journey."
        bgImage="https://picsum.photos/seed/nyle_contact/1920/1080"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Contact Info Column */}
            <div className="lg:col-span-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-gray-900 leading-tight">Get in Touch</h2>
                <p className="text-gray-600 leading-relaxed">
                  Have a question or ready to start planning? Reach out to us through any of these channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <info.icon size={24} />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm leading-relaxed mb-1 italic">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    <FiMessageSquare size={20} />
                  </div>
                  <h3 className="text-2xl font-serif text-gray-900">Send us a Message</h3>
                </div>
                
                <ContactForm />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-[600px] relative overflow-hidden grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.5!2d36.8!3d-1.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1!2sNairobi!5e0!3m2!1sen!2ske!4v1!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
