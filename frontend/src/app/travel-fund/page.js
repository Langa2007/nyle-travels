'use client';

import Link from 'next/link';
import { FiArrowRight, FiCreditCard, FiRefreshCw, FiShield, FiUsers } from 'react-icons/fi';
import Button from '@/components/ui/Button';

const steps = [
  {
    title: 'Create the trip fund',
    text: 'Choose full payment, Lipa Pole Pole, or a group pool from the cart checkout.',
    icon: FiCreditCard,
  },
  {
    title: 'Collect with M-Pesa',
    text: 'Guests pay through STK or shared payment links. Every contribution is tied to the fund ledger.',
    icon: FiUsers,
  },
  {
    title: 'Hold as customer funds',
    text: 'Money is treated as a customer liability until the booking is confirmed with suppliers.',
    icon: FiShield,
  },
  {
    title: 'Release by milestone',
    text: 'Supplier payables and Nyle commission are released only after confirmation or fulfilment milestones.',
    icon: FiRefreshCw,
  },
];

export default function TravelFundPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-28">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">
            <FiShield /> Customer funds custody
          </div>
          <h1 className="mt-6 font-serif text-4xl font-bold text-gray-900 md:text-5xl">
            Pay slowly, pay together, and keep every shilling traceable.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Nyle Travel funds are designed for Kenyan trips where friends, families, and chamas contribute over time.
            Contributions are recorded against the traveller or group, held through a licensed provider or escrow
            partner, and kept separate from Nyle revenue until the trip is confirmed.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/cart">
              <Button icon={FiArrowRight} iconPosition="right">Start from cart</Button>
            </Link>
            <Link href="/tours">
              <Button variant="outline">Browse trips</Button>
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Who holds the money?</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
            <p>
              The intended holder is a licensed payment or escrow provider connected to M-Pesa. Nyle maintains the
              trip ledger and reconciliation trail.
            </p>
            <p>
              Before confirmation, the balance is a customer liability. After confirmation, the ledger separates
              supplier payables, Nyle commission, taxes, and refundable balances.
            </p>
          </div>
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            Live collections require Daraja credentials, callback URLs, and escrow provider credentials in the backend
            environment.
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
