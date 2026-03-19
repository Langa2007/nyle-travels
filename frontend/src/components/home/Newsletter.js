'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/wmkm5b/800/600"
          alt="Newsletter Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
              <FiMail className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Join Our Luxury Travel Community
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-12">
              Subscribe to receive exclusive offers, travel inspiration, and insider tips from our luxury travel experts.
            </p>

            {/* Subscription Form */}
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="group"
                  >
                    {loading ? 'Subscribing...' : (
                      <>
                        Subscribe
                        <FiSend className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto"
              >
                <FiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Thank You for Subscribing!
                </h3>
                <p className="text-gray-300">
                  You're now part of our exclusive travel community. Check your inbox for a special welcome offer!
                </p>
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
              <div className="text-gray-400">✦ 10,000+ Subscribers</div>
              <div className="text-gray-400">✦ No Spam Guarantee</div>
              <div className="text-gray-400">✦ Exclusive Offers</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
