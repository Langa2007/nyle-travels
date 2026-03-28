'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 p-12 rounded-3xl text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
          <FiCheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-serif text-gray-900 mb-4">Message Sent Successfully</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out to Nyle Travel. Our luxury travel consultants will get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
          <input
            required
            type="text"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
          <input
            required
            type="email"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            placeholder="+254 700 000 000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Interest</label>
          <select className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer">
            <option>General Inquiry</option>
            <option>Luxury Safari Booking</option>
            <option>Beach Holiday Packages</option>
            <option>Corporate Travel</option>
            <option>Honeymoon Special</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 ml-1">Your Message</label>
        <textarea
          required
          rows={5}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Tell us about your dream trip..."
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        fullWidth
        size="lg"
        icon={FiSend}
        iconPosition="right"
        className="mt-4"
      >
        Send Inquiry
      </Button>

      <p className="text-center text-xs text-gray-400 mt-6">
        By submitting this form, you agree to our <a href="/privacy" className="underline hover:text-primary-500 transition-colors">Privacy Policy</a>.
      </p>
    </form>
  );
}
