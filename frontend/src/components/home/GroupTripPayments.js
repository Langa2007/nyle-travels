'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiShield, FiSmartphone, FiUsers } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const benefits = [
  {
    icon: FiUsers,
    title: 'Equal member contributions',
    text: 'Split the trip cost across friends, family, or chama members so everyone pays their agreed share directly.',
  },
  {
    icon: FiSmartphone,
    title: 'M-Pesa friendly installments',
    text: 'Start with a deposit, then contribute over time through simple payment links built for Kenyan travellers.',
  },
  {
    icon: FiShield,
    title: 'Secure fund tracking',
    text: 'Every payment is recorded against the trip fund before supplier payouts or Nyle commission are released.',
  },
];

export default function GroupTripPayments() {
  return (
    <section className="relative bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-700">
              <FiCheckCircle /> Group trips made easier
            </span>
            <h2 className="mt-6 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Travel together, pay together, without chasing anyone.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Nyle Travel now supports group trips with secure installment payments. Create a trip fund, share the link
              on WhatsApp, and let each member contribute the same agreed amount through M-Pesa-friendly payment flows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/travel-fund">
                <Button icon={FiArrowRight} iconPosition="right">
                  See how it works
                </Button>
              </Link>
              <Link href="/tours">
                <Button variant="outline">Plan a group trip</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
          >
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Sample group pool</p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">Naivasha weekend escape</h3>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Collecting</span>
              </div>

              <div className="mt-5 grid gap-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <Icon />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{benefit.title}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{benefit.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl bg-primary-900 p-4 text-white">
                <div className="flex justify-between text-sm text-white/70">
                  <span>8 members</span>
                  <span>KES 12,500 each</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/20">
                  <div className="h-2 w-2/3 rounded-full bg-primary-400" />
                </div>
                <div className="mt-3 flex justify-between text-sm font-bold">
                  <span>KES 75,000 collected</span>
                  <span>KES 100,000 goal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
